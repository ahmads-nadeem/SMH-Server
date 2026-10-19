const { doctorServices, patientsTables, insertPatient, addVisit, addPatientAdvice } = require('../model/doctorModel');
const html_to_pdf = require('html-pdf-node');

exports.insertPatient = async (req, res) => {
  const { patientDetails, patientPurchses } = req.body;
  const { name, phone, age, gender } = patientDetails;
  const ser = await doctorServices();
  let totalBill = 0;
  function spec(service) {
    const specific = ser.filter(obj => obj.service == service)
    return Number(specific[0].price)
  }

  if (patientPurchses.service.includes('ultrasound')) {
    totalBill = totalBill + spec('ultrasound')
  }
  if (patientPurchses.service.includes('checkup')) {
    totalBill = totalBill + spec('checkup')
  }


  const addPatientDetails = await insertPatient(name, phone, age, gender);
  const addPatientVisit = await addVisit(patientDetails, addPatientDetails, totalBill);

  if (patientPurchses.service.length == 0) {
    return res.status(201).json({
      message: 'success',
      report: {
        date: addPatientVisit.visit_date,
        opdToken: addPatientVisit.vid,
        patientName: addPatientVisit.patient_name,
        age: addPatientVisit.age,
        gravidaPara: addPatientVisit.gpa,
        lmp: addPatientVisit.lmp,
        gestationalAge: addPatientVisit.gestationalage,
        chiefComplaint: addPatientVisit.visit_purpose,
        clinicalFindings: addPatientVisit.clinical_findings,
        hb: addPatientVisit.hb,
        bp: addPatientVisit.bp,
        urine: addPatientVisit.urine,
        suger: addPatientVisit.suger,
        treatment: '',
        nextVisit: addPatientVisit.nextvisit,
        remarks: addPatientVisit.remarks
      }
    })
  }
}
await addPatientAdvice(patientPurchses.medicine, addPatientVisit.insertId);
const medicine = patientPurchses.medicine.map((value, index) => {
  return value.productName
})

res.status(201).json({
  message: 'success',
  report: {
    date: addPatientVisit.visit_date,
    opdToken: addPatientVisit.vid,
    patientName: addPatientVisit.patient_name,
    age: addPatientVisit.age,
    gravidaPara: addPatientVisit.gpa,
    lmp: addPatientVisit.lmp,
    gestationalAge: addPatientVisit.gestationalage,
    chiefComplaint: addPatientVisit.visit_purpose,
    clinicalFindings: addPatientVisit.clinical_findings,
    hb: addPatientVisit.hb,
    bp: addPatientVisit.bp,
    urine: addPatientVisit.urine,
    suger: addPatientVisit.suger,
    treatment: medicine.join(", "),
    nextVisit: addPatientVisit.nextvisit,
    remarks: addPatientVisit.remarks
  }
})


exports.doctorServices = async (req, res) => {
  const fetchedServices = await doctorServices();
  res.status(200).json({ fetchedServices });
}
exports.patientsTables = async (req, res) => {
  const fetchPatients = await patientsTables();
  res.status(200).json({ ...fetchPatients });
}

exports.printReport = async (req, res) => {
  const { date, opdToken, patientName, age, gravidaPara, lmp, gestationalAge, chiefComplaint, clinicalFindings, hb, bp, urine, suger, treatment, nextVisit, remarks } = req.body
  try {
    // 1. Dynamic Data (Aap Database se fetch kar sakte hain)
    const headerInfo = {
      facilityName: "SALMA HOSPITAL",
      phcRegNo: "PHC-123456",
      address: "Main Road, City",
      phone: "0300-1234567",
      registerNo: "REG-2026",
      year: "2026",
      pageNo: "01"
    };

    const patientRows = [
      {
        sNo: 1,
        date,
        opdToken,
        patientName,
        age,
        gravidaPara,
        lmp,
        gestationalAge,
        chiefComplaint,
        clinicalFindings,
        hb,
        bp,
        urine,
        others: suger,
        treatment,
        nextVisit,
        remarks,
        signature: ''
      }
      // Baqi rows yahan loop se add ho sakti hain
    ];

    // Empty rows add karne ke liye taake page poora 15 rows ka bane
    while (patientRows.length < 15) {
      patientRows.push({
        sNo: patientRows.length + 1,
        date: '', opdToken: '', patientName: '', age: '',
        gravidaPara: '', lmp: '', gestationalAge: '', chiefComplaint: '',
        clinicalFindings: '', hb: '', bp: '', urine: '', others: '',
        treatment: '', nextVisit: '', remarks: '', signature: ''
      });
    }

    // 2. HTML + CSS Template (Exact image layout)
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @page { size: A4 landscape; margin: 8mm; }
        body { font-family: Arial, sans-serif; font-size: 10px; color: #000; margin: 0; padding: 0; }
        
        .header-container { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .header-left, .header-right { width: 30%; }
        .header-center { width: 40%; text-align: center; }
        .header-center h2 { margin: 0; font-size: 18px; text-transform: uppercase; }
        .header-center h3 { margin: 2px 0 0 0; font-size: 15px; font-weight: normal; }
        
        .line-item { margin-bottom: 3px; }
        .line-title { font-weight: bold; }
        .underline { display: inline-block; border-bottom: 1px solid #000; min-width: 120px; padding-left: 5px; }

        .boxed-header { border: 1px solid #000; padding: 5px; font-size: 10px; width: 140px; float: right; }

        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th, td { border: 1px solid #000; text-align: center; padding: 4px 2px; height: 18px; font-size: 9px; }
        th { background-color: #f9f9f9; font-weight: normal; }
        .sub-header th { font-size: 8px; font-weight: bold; }

        .footer-container { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 25px; padding: 0 10px; }
        .stamp-box { border: 1px solid #000; border-radius: 50%; width: 55px; height: 55px; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 9px; }
      </style>
    </head>
    <body>

      <!-- Header Section -->
      <div class="header-container">
        <div class="header-left">
          <div class="line-item"><span class="line-title">Facility Name:</span> <span class="underline">${headerInfo.facilityName}</span></div>
          <div class="line-item"><span class="line-title">PHC Registration No.:</span> <span class="underline">${headerInfo.phcRegNo}</span></div>
          <div class="line-item"><span class="line-title">Address:</span> <span class="underline">${headerInfo.address}</span></div>
          <div class="line-item"><span class="line-title">Phone:</span> <span class="underline">${headerInfo.phone}</span></div>
        </div>

        <div class="header-center">
          <h2>MATERNITY OPD</h2>
          <h3>ANC REGISTER (SPECIMEN)</h3>
        </div>

        <div class="header-right">
          <div class="boxed-header">
            <div>Register No.: <u>${headerInfo.registerNo}</u></div>
            <div>Year: <u>${headerInfo.year}</u></div>
            <div>Page No.: <u>${headerInfo.pageNo}</u></div>
          </div>
        </div>
      </div>

      <!-- Main Table -->
      <table>
        <thead>
          <tr>
            <th rowspan="2">S. No.</th>
            <th rowspan="2">Date</th>
            <th rowspan="2">OPD / Token No.</th>
            <th rowspan="2">Name of Patient</th>
            <th rowspan="2">Age (Yrs)</th>
            <th rowspan="2">Gravida (G)<br>Para (P)</th>
            <th rowspan="2">LMP<br>(dd/mm/yy)</th>
            <th rowspan="2">Gestational Age (Weeks)</th>
            <th rowspan="2">Chief Complaint / Purpose of Visit</th>
            <th rowspan="2">Clinical Findings / Examination</th>
            <th colspan="4">Investigations</th>
            <th rowspan="2">Treatment / Advice</th>
            <th rowspan="2">Next Visit Date</th>
            <th rowspan="2">Remarks</th>
            <th rowspan="2">Signature / Initials of Staff</th>
          </tr>
          <tr>
            <th>Hb</th>
            <th>BP</th>
            <th>Urine</th>
            <th>Suger</th>
          </tr>
          <tr class="sub-header">
            <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>10</th><th>11</th><th>12</th><th>12</th><th>14</th><th>14</th><th>15</th><th>16</th><th>18</th><th>19</th>
          </tr>
        </thead>
        <tbody>
          ${patientRows.map(row => `
            <tr>
              <td>${row.sNo}</td>
              <td>${row.date}</td>
              <td>${row.opdToken}</td>
              <td>${row.patientName}</td>
              <td>${row.age}</td>
              <td>${row.gravidaPara}</td>
              <td>${row.lmp}</td>
              <td>${row.gestationalAge}</td>
              <td>${row.chiefComplaint}</td>
              <td>${row.clinicalFindings}</td>
              <td>${row.hb}</td>
              <td>${row.bp}</td>
              <td>${row.urine}</td>
              <td>${row.others}</td>
              <td>${row.treatment}</td>
              <td>${row.nextVisit}</td>
              <td>${row.remarks}</td>
              <td>${row.signature}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Footer Signatures -->
      <div class="footer-container">
        <div>Prepared By: _____________________<br><small style="margin-left:70px;">(Name & Designation)</small></div>
        <div>Checked By: _____________________<br><small style="margin-left:70px;">(Name & Designation)</small></div>
        <div>Approved By: _____________________<br><small style="margin-left:70px;">(Medical Superintendent)</small></div>
        <div class="stamp-box">Official<br>Stamp</div>
      </div>

    </body>
    </html>
    `;

    // 3. Options for PDF Generation
    let options = { format: 'A4', landscape: true, printBackground: true };
    let file = { content: htmlContent };

    // 4. Generate PDF & Stream directly to Browser
    html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="ANC_Register.pdf"');
      res.send(pdfBuffer);
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("PDF Error");
  }
};
