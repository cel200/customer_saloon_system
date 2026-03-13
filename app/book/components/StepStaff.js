'use client';

export default function StepStaff({ styles, onBack, selectedStaff, handleStaffSelect, staffList }) {
  return (
    <div className={styles.step}>
      <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '1.5rem' }}>← Back</button>
      <h2 className={styles.stepTitle}>Choose Your Specialist</h2>

      <div className={styles.grid}>
        <div
          className={`${styles.card} ${selectedStaff === null ? styles.selected : ''}`}
          onClick={() => handleStaffSelect(null)}
        >
          <div className={styles.serviceInfo}>
            <h3>Any Available Staff</h3>
            <p>Best for quick booking</p>
          </div>
        </div>

        {staffList?.map((staff) => (
          <div
            key={staff?._id || staff?.id}
            className={`${styles.card} ${selectedStaff?._id === staff?._id || selectedStaff?.id === staff?.id ? styles.selected : ''}`}
            onClick={() => handleStaffSelect(staff)}
          >
            <div className={styles.serviceInfo}>
              <h3>{staff?.fullName}</h3>
              <p>{staff?.specialization || 'Expert Stylist'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
