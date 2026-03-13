"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ServiceCard from "../components/ServiceCard";
import Navbar from "../components/Navbar";
import { listSectionByGender } from "@/store/userThunk";
import styles from "./ServicesPage.module.css";

export default function Services() {
  const dispatch = useDispatch();

  const [selectedAudience, setSelectedAudience] = useState("Men");
  const [selectedCategory, setSelectedCategory] = useState({ id: "", name: "" });

  const { listSectionByGenderData } = useSelector(
    (state) => state.listSectionByGender
  );

  const audienceButtons = useMemo(
    () => [
      { id: "Men", label: "Men" },
      { id: "Women", label: "Women" },
      { id: "Kids", label: "Kids" },
    ],
    []
  );

  useEffect(() => {
    dispatch(listSectionByGender({ gender: selectedAudience }));
  }, [dispatch, selectedAudience]);

  useEffect(() => {
    const categories = listSectionByGenderData?.data || [];

    if (!categories.length) {
      setSelectedCategory({ id: "", name: "" });
      return;
    }

    const hairCategory = categories.find(
      (category) => category?.name?.toLowerCase() === "hair"
    );

    const defaultCategory = hairCategory || categories[0];
    setSelectedCategory({
      id: defaultCategory?._id || "",
      name: defaultCategory?.name || "",
    });
  }, [listSectionByGenderData, selectedAudience]);

  const handleAudienceChange = (audience) => {
    setSelectedAudience(audience);
    setSelectedCategory({ id: "", name: "" });
  };

  return (
    <div className={styles.pageWrap}>
      <Navbar />
      <section className={`container ${styles.section}`}>
        <div className={styles.headerRow}>
          <h1 className={`section-title ${styles.sectionTitle}`}>Our Services</h1>
        </div>

        <div className={styles.filtersWrap}>
          <div className={styles.filterRow}>
            {audienceButtons.map((audience) => (
              <button
                key={audience.id}
                type="button"
                onClick={() => handleAudienceChange(audience.id)}
                className={`${styles.audienceChip} ${
                  selectedAudience === audience.id ? styles.audienceChipActive : ""
                }`}
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
                onClick={() =>
                  setSelectedCategory({ id: category?._id, name: category?.name })
                }
                className={`${styles.categoryChip} ${
                  selectedCategory?.id === category?._id
                    ? styles.categoryChipActive
                    : ""
                }`}
              >
                {category?.name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          <ServiceCard
            selectedAudience={selectedAudience}
            selectedCategoryId={selectedCategory?.id}
          />
        </div>
      </section>
    </div>
  );
}
