// Debug script om tijdslot problemen op te lossen
const { query } = require('./api/dist/lib/database/config.js');

async function debugSlots() {
  try {
    console.log('🔍 Debugging tijdslot systeem...\n');

    // 1. Check welke dag van de week het is
    const testDate = '2025-08-15';
    const dateObj = new Date(testDate);
    const dayOfWeek = dateObj.getDay();
    console.log(`📅 Test datum: ${testDate} (dag ${dayOfWeek} - ${['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'][dayOfWeek]})`);

    // 2. Check of er tijdslots zijn gedefinieerd voor deze dag
    const slotsResult = await query(`
      SELECT day_of_week, start_time, end_time, is_available 
      FROM appointment_time_slots 
      WHERE day_of_week = $1 
      ORDER BY start_time
    `, [dayOfWeek]);
    
    console.log(`\n⏰ Gedefinieerde tijdslots voor dag ${dayOfWeek}:`);
    if (slotsResult.rows.length === 0) {
      console.log('❌ PROBLEEM: Geen tijdslots gedefinieerd voor deze dag!');
    } else {
      slotsResult.rows.forEach(slot => {
        console.log(`   ${slot.start_time} - ${slot.end_time} (beschikbaar: ${slot.is_available})`);
      });
    }

    // 3. Check bestaande afspraken voor deze datum
    const appointmentsResult = await query(`
      SELECT appointment_time, status, reference_number 
      FROM appointments 
      WHERE appointment_date = $1 
      ORDER BY appointment_time
    `, [testDate]);
    
    console.log(`\n📋 Bestaande afspraken voor ${testDate}:`);
    if (appointmentsResult.rows.length === 0) {
      console.log('   Geen afspraken gevonden');
    } else {
      appointmentsResult.rows.forEach(apt => {
        console.log(`   ${apt.appointment_time} - Status: ${apt.status} (Ref: ${apt.reference_number})`);
      });
    }

    // 4. Test de get_available_slots functie
    console.log(`\n🔧 Testing get_available_slots('${testDate}'):`);
    const availableResult = await query(`SELECT * FROM get_available_slots($1::date)`, [testDate]);
    
    console.log(`Resultaat (${availableResult.rows.length} slots):`);
    availableResult.rows.forEach(slot => {
      const status = slot.is_available ? '✅ Beschikbaar' : '❌ Bezet';
      console.log(`   ${slot.slot_time} - ${status}`);
    });

    // 5. Check geblokkeerde datums
    const blockedResult = await query(`SELECT * FROM blocked_dates WHERE blocked_date = $1`, [testDate]);
    
    console.log(`\n🚫 Geblokkeerde datum check voor ${testDate}:`);
    if (blockedResult.rows.length === 0) {
      console.log('   Datum is niet geblokkeerd');
    } else {
      console.log(`   ❌ Datum is geblokkeerd: ${blockedResult.rows[0].reason}`);
    }

    // 6. Quick fix: clear alle test afspraken voor vandaag/morgen
    console.log('\n🧹 Clearing test afspraken...');
    const clearResult = await query(`
      DELETE FROM appointments 
      WHERE appointment_date >= CURRENT_DATE 
      AND reference_number LIKE 'TT%'
    `);
    console.log(`   Verwijderd: ${clearResult.rowCount} test afspraken`);

    // 7. Test opnieuw na cleanup
    console.log('\n🔄 Test na cleanup:');
    const finalTest = await query(`SELECT * FROM get_available_slots($1::date)`, [testDate]);
    const availableCount = finalTest.rows.filter(row => row.is_available).length;
    console.log(`   Beschikbare slots: ${availableCount}/${finalTest.rows.length}`);

    if (availableCount === 0) {
      console.log('\n❌ NOG STEEDS PROBLEEM: Geen beschikbare slots!');
      console.log('Mogelijke oorzaken:');
      console.log('- Tijdslots niet correct gedefinieerd');
      console.log('- Database functie werkt niet goed');
      console.log('- Datum is weekend of buiten kantooruren');
    } else {
      console.log('\n✅ PROBLEEM OPGELOST: Tijdslots zijn nu beschikbaar!');
    }

  } catch (error) {
    console.error('❌ Fout tijdens debug:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugSlots();
