'use client';

export default function StepService({
  styles,
  audienceButtons,
  selectedAudience,
  handleAudienceChange,
  listSectionByGenderData,
  selectedCategory,
  setSelectedCategory,
  setSelectedService,
  services,
  selectedService,
  handleServiceSelect,
}) {
  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>Select Your Service</h2>

      <div className={styles.filtersWrap}>
        <div className={styles.filterRow}>
          {audienceButtons.map((audience) => (
            <button
              key={audience.id}
              type="button"
              onClick={() => handleAudienceChange(audience.id)}
              className={`${styles.audienceChip} ${selectedAudience === audience.id ? styles.audienceChipActive : ''}`}
            >
              {audience.label}
            </button>
          ))}
        </div>
        <div className={styles.filterRow}>
          {listSectionByGenderData?.data?.map((category) => (
            <button
              key={category._id}
              type="button"
              onClick={() => {
                setSelectedCategory({ id: category?._id, name: category?.name });
                setSelectedService(null);
              }}
              className={`${styles.categoryChip} ${selectedCategory?.id === category?._id ? styles.categoryChipActive : ''}`}
            >
              {category?.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {services.map((service) => (
          <div
            key={service.id}
            className={`${styles.card} ${selectedService?.id === service.id ? styles.selected : ''}`}
            onClick={() => handleServiceSelect(service)}
          >
            <div className={styles.serviceInfo}>
              <h3>{service.name}</h3>
              <p>
                <span className={styles.durationBadge}>
                  {service.duration || '45'} min
                </span>
              </p>
            </div>
            <div className={styles.priceTag}>
              {service.price}Rs
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
