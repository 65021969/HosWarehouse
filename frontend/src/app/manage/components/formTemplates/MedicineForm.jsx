'use client';

import React from 'react';
import styles from './page.module.css';

export default function MedicineForm({ form, handleChange }) {
    return (
        <fieldset className={styles.section}>
            <legend className={styles.legend}>ยา</legend>

            <div className={styles.grid}>

                {/*–– 1 กลุ่มยาข้อมูลทั่วไป ––*/}
                <div className={styles.field}>
                    <label htmlFor="med_generic_name">ชื่อสามัญ (Generic)</label>
                    <input
                        id="med_generic_name"
                        name="med_generic_name"
                        value={form.med_generic_name ?? ''}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="med_thai_name">ชื่อภาษาไทย</label>
                    <input
                        id="med_thai_name"
                        name="med_thai_name"
                        value={form.med_thai_name ?? ''}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="med_marketing_name">ชื่อการค้า (Brand)</label>
                    <input
                        id="med_marketing_name"
                        name="med_marketing_name"
                        value={form.med_marketing_name ?? ''}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="med_counting_unit">หน่วยนับ (เช่น Tablet / Vial)</label>
                    <input
                        id="med_counting_unit"
                        name="med_counting_unit"
                        value={form.med_counting_unit ?? ''}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="med_dosage_form">รูปแบบยา (Dosage form)</label>
                    <input
                        id="med_dosage_form"
                        name="med_dosage_form"
                        value={form.med_dosage_form ?? ''}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="med_medical_category">หมวดทางการแพทย์</label>
                    <input
                        id="med_medical_category"
                        name="med_medical_category"
                        value={form.med_medical_category ?? ''}
                        onChange={handleChange}
                    />
                </div>

                {/*–– 2 กลุ่มราคา ––*/}
                <div className={styles.field}>
                    <label htmlFor="med_cost_price">ราคาทุน (บาท)</label>
                    <input
                        type="number"
                        step="0.01"
                        id="med_cost_price"
                        name="med_cost_price"
                        value={form.med_cost_price ?? ''}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="med_selling_price">ราคาขาย (บาท)</label>
                    <input
                        type="number"
                        step="0.01"
                        id="med_selling_price"
                        name="med_selling_price"
                        value={form.med_selling_price ?? ''}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="med_medium_price">ราคากลาง (บาท)</label>
                    <input
                        type="number"
                        step="0.01"
                        id="med_medium_price"
                        name="med_medium_price"
                        value={form.med_medium_price ?? ''}
                        onChange={handleChange}
                    />
                </div>

                {/*–– 3 กลุ่มรหัสมาตรฐาน ––*/}
                <div className={styles.field}>
                    <label htmlFor="med_tmt_code">รหัส TMT</label>
                    <input
                        id="med_tmt_code"
                        name="med_tmt_code"
                        value={form.med_tmt_code ?? ''}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="med_tpu_code">รหัส TPU</label>
                    <input
                        id="med_tpu_code"
                        name="med_tpu_code"
                        value={form.med_tpu_code ?? ''}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="med_tmt_gp_name">TMT GP Name</label>
                    <input
                        id="med_tmt_gp_name"
                        name="med_tmt_gp_name"
                        value={form.med_tmt_gp_name ?? ''}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="med_tmt_tp_name">TMT TP Name</label>
                    <input
                        id="med_tmt_tp_name"
                        name="med_tmt_tp_name"
                        value={form.med_tmt_tp_name ?? ''}
                        onChange={handleChange}
                    />
                </div>

                {/*–– 4 กลุ่มสถานะและปริมาณ ––*/}
                <div className={styles.field}>
                    <label htmlFor="med_severity">ระดับความรุนแรง (เช่น Mild/Severe)</label>
                    <input
                        id="med_severity"
                        name="med_severity"
                        value={form.med_severity ?? ''}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="med_essential_med_list">ยาหลัก (บัญชียาหลัก [Y/N])</label>
                    <select
                        id="med_essential_med_list"
                        name="med_essential_med_list"
                        value={form.med_essential_med_list ?? ''}
                        onChange={handleChange}
                    >
                        <option value="">-- เลือก --</option>
                        <option value="Y">Y</option>
                        <option value="N">N</option>
                    </select>
                </div>

                <div className={styles.field}>
                    <label htmlFor="med_pregnancy_cagetory">หมวดหญิงตั้งครรภ์</label>
                    <input
                        id="med_pregnancy_cagetory"
                        name="med_pregnancy_cagetory"
                        value={form.med_pregnancy_cagetory ?? ''}
                        onChange={handleChange}
                    />
                </div>

                {/*–– 5 กลุ่มวันหมดอายุ/ผลิต ––*/}
                <div className={styles.field}>
                    <label htmlFor="med_mfg">วันที่ผลิต</label>
                    <input
                        type="date"
                        id="med_mfg"
                        name="med_mfg"
                        value={form.med_mfg ?? ''}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="med_exp">วันหมดอายุ</label>
                    <input
                        type="date"
                        id="med_exp"
                        name="med_exp"
                        value={form.med_exp ?? ''}
                        onChange={handleChange}
                    />
                </div>

                {/*–– 6 อื่น ๆ ––*/}
                <div className={styles.field}>
                    <label htmlFor="med_dose_dialogue">วิธีใช้ / คำแนะนำ</label>
                    <textarea
                        id="med_dose_dialogue"
                        name="med_dose_dialogue"
                        value={form.med_dose_dialogue ?? ''}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="med_replacement">ยาทดแทน (ถ้ามี)</label>
                    <input
                        id="med_replacement"
                        name="med_replacement"
                        value={form.med_replacement ?? ''}
                        onChange={handleChange}
                    />
                </div>

            </div>
        </fieldset>
    );
}
