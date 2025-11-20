import { html } from 'https://esm.sh/htm/preact';
import { useState } from 'https://esm.sh/preact/hooks';

const PatientDetails = ({ setView, setPatientData }) => {
    const [formData, setFormData] = useState({
        chiefComplaint: '',
        firstName: '',
        lastName: '',
        fathersName: '',
        ward: '',
        room: '',
        bed: '',
        physician: '',
        admissionDate: new Date().toISOString().split('T')[0],
        dob: '',
        bp: '',
        pr: '',
        rr: '',
        temp: '',
        spo2: '',
        communicationStyle: 'first-person' // 'first-person' or 'second-person'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!formData.chiefComplaint) {
            alert('Please enter a Chief Complaint / شکایت اصلی را وارد کنید');
            return;
        }
        setPatientData(formData);
        setView('interview');
    };

    // Simple Persian Date Display
    const getPersianDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
                year: 'numeric', month: 'long', day: 'numeric'
            }).format(new Date(dateStr));
        } catch (e) { return ''; }
    };

    return html`
        <div class="flex flex-col gap-4 animate-fade-in">
            <div class="card">
                <div class="bilingual-text mb-4">
                    <span class="text-fa">مشخصات بیمار</span>
                    <span class="text-en">Patient Details</span>
                </div>

                <div class="input-group">
                    <div class="bilingual-text mb-2">
                        <span class="text-fa">شکایت اصلی (اجباری)</span>
                        <span class="text-en">Chief Complaint (Required)</span>
                    </div>
                    <input name="chiefComplaint" value=${formData.chiefComplaint} onInput=${handleChange} placeholder="e.g. Chest Pain" />
                </div>

                <div class="flex gap-4">
                    <div class="input-group w-full">
                        <div class="bilingual-text mb-2"><span class="text-fa">نام</span><span class="text-en">Name</span></div>
                        <input name="firstName" value=${formData.firstName} onInput=${handleChange} />
                    </div>
                    <div class="input-group w-full">
                        <div class="bilingual-text mb-2"><span class="text-fa">نام خانوادگی</span><span class="text-en">Family Name</span></div>
                        <input name="lastName" value=${formData.lastName} onInput=${handleChange} />
                    </div>
                </div>
                
                <div class="input-group">
                    <div class="bilingual-text mb-2"><span class="text-fa">نام پدر</span><span class="text-en">Father's Name</span></div>
                    <input name="fathersName" value=${formData.fathersName} onInput=${handleChange} />
                </div>

                <div class="flex gap-2">
                    <div class="input-group w-full">
                        <label class="text-en">Ward</label>
                        <input name="ward" value=${formData.ward} onInput=${handleChange} />
                    </div>
                    <div class="input-group w-full">
                        <label class="text-en">Room</label>
                        <input name="room" value=${formData.room} onInput=${handleChange} />
                    </div>
                    <div class="input-group w-full">
                        <label class="text-en">Bed</label>
                        <input name="bed" value=${formData.bed} onInput=${handleChange} />
                    </div>
                </div>

                <div class="input-group">
                    <div class="bilingual-text mb-2"><span class="text-fa">تاریخ پذیرش</span><span class="text-en">Admission Date</span></div>
                    <input type="date" name="admissionDate" value=${formData.admissionDate} onInput=${handleChange} />
                    <div class="text-fa mt-1" style="font-size: 0.9em; color: var(--accent)">
                        ${getPersianDate(formData.admissionDate)}
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="bilingual-text mb-4">
                    <span class="text-fa">علائم حیاتی</span>
                    <span class="text-en">Vitals</span>
                </div>
                <div class="flex gap-2 flex-wrap">
                    <input class="w-full" style="flex: 1; min-width: 100px" name="bp" placeholder="BP (mmHg)" value=${formData.bp} onInput=${handleChange} />
                    <input class="w-full" style="flex: 1; min-width: 100px" name="pr" placeholder="PR (bpm)" value=${formData.pr} onInput=${handleChange} />
                    <input class="w-full" style="flex: 1; min-width: 100px" name="rr" placeholder="RR (/min)" value=${formData.rr} onInput=${handleChange} />
                    <input class="w-full" style="flex: 1; min-width: 100px" name="temp" placeholder="Temp (°C)" value=${formData.temp} onInput=${handleChange} />
                    <input class="w-full" style="flex: 1; min-width: 100px" name="spo2" placeholder="SpO2 (%)" value=${formData.spo2} onInput=${handleChange} />
                </div>
            </div>

            <div class="card">
                <div class="bilingual-text mb-4">
                    <span class="text-fa">تنظیمات دستیار هوشمند</span>
                    <span class="text-en">AI Assistant Settings</span>
                </div>
                
                <div class="input-group">
                    <label class="text-en mb-2 block">Communication Style</label>
                    <select name="communicationStyle" value=${formData.communicationStyle} onChange=${handleChange}>
                        <option value="first-person">First Person (Conscious Patient)</option>
                        <option value="second-person">Second Person (Unconscious/Attendant)</option>
                    </select>
                </div>
            </div>

            <button class="btn w-full" onClick=${handleSubmit} style="margin-top: 16px; font-size: 1.1em;">
                <span>شروع مصاحبه</span>
                <span>Start Interview</span>
                <span>➡️</span>
            </button>
        </div>
    `;
};

export default PatientDetails;
