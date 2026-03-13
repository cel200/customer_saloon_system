"use client";
import Link from "next/link";
import styles from "./ServiceCard.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listServices } from "@/store/userThunk";

const ServiceCard = ({ selectedAudience, selectedCategoryId }) => {
  const dispatch = useDispatch();

  const { listServicesData } = useSelector(
    (state) => state.listServices
  );

  useEffect(() => {
    if (!selectedAudience) return;

    const payload = {
      gender: selectedAudience,
    };

    if (selectedCategoryId) {
      payload.section = selectedCategoryId;
    }

    dispatch(
      listServices(payload)
    );
  }, [dispatch, selectedAudience, selectedCategoryId]);

  const handleBookNow = (service) => {
    try {
      sessionStorage.setItem(
        "pendingBookingSelection",
        JSON.stringify({
          serviceId: service?._id || service?.id || "",
          sectionId: selectedCategoryId || "",
          gender: selectedAudience || "",
        })
      );
    } catch {
      // no-op
    }
  };

  return (
    <>
      {listServicesData?.data?.map((service) => (
        <div className={styles.card} key={service._id}>
          <div
            className={styles.image}
            style={{
              backgroundImage: `url(${service?.image})`,
            }}
          ></div>

          <div className={styles.content}>
            <h3>{service?.serviceName}</h3>
            <p>{service?.description}</p>

            <div className={styles.meta}>
              <span className={styles.price}>
                {service?.price}Rs
              </span>
              <span className={styles.duration}>
                {service?.duration} mins
              </span>
            </div>

            <Link
              href="/book?skip=true"
              onClick={() => handleBookNow(service)}
              className="btn btn-primary"
              style={{
                width: "100%",
                marginTop: "1rem",
                display: "block",
                textAlign: "center",
              }}
            >
              Book Now
            </Link>
          </div>
        </div>
      ))}
    </>
  );
};

export default ServiceCard;
