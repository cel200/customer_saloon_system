'use client';

export default function StepDateTime({
  styles,
  onBack,
  selectedDate,
  setSelectedDate,
  selectedSlot,
  handleSlotSelect,
  generateSlots,
}) {
  return (
    <div className={styles.step}>
      <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '1.5rem' }}>← Back</button>
      <h2 className={styles.stepTitle}>Select Date & Time</h2>

      <div className={styles.filtersWrap}>
        <input
          type="date"
          className={styles.dateInput}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          value={selectedDate}
        />
      </div>

      {selectedDate && (
        <div className={styles.grid}>
          {(generateSlots || [])?.map((slot,index) => (
            <div
              key={index}
              className={`${styles.card} ${selectedSlot === slot ? styles.selected : ''}`}
              onClick={() => {
                if (slot) {
                  handleSlotSelect(slot);
                }
              }}
              style={{
                // cursor: slot.isBreak ? 'not-allowed' : 'pointer',
                // opacity: slot.isBreak ? 0.5 : 1,
                cursor:"pointer"
              }}
            >
              <div className={styles.serviceInfo}>
                <h3>{slot}</h3>
                {/* {slot.isBreak && <p>Break Time</p>} */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
