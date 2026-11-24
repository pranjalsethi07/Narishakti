import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle, ScanText } from 'lucide-react';
import { recognize } from 'tesseract.js';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { apiFetch } from '../../utils/api';

GlobalWorkerOptions.workerSrc = pdfWorker;

const FINANCE_WORDS = [
  // Account terms
  'account balance', 'closing balance', 'available balance', 'opening balance', 'account holder',
  // Transaction types
  'debit', 'credit', 'deposit', 'withdrawal', 'purchase', 'payment', 'transfer', 'transaction',
  // Loan related
  'loan', 'emi', 'principal', 'interest', 'loan amount', 'loan tenure', 'home loan', 'car loan',
  'personal loan', 'business loan', 'loan disbursed', 'loan status',
  // Credit card terms
  'credit', 'due date', 'minimum due', 'outstanding', 'net payable', 'credit limit', 'credit score',
  'credit utilization', 'credit available', 'credit used', 'payment due',
  // Taxes and charges
  'gst', 'tax', 'tds', 'igst', 'sgst', 'cgst', 'income tax', 'service tax', 'tax deducted',
  'charges', 'fee', 'commission', 'processing fee', 'annual fee', 'atm charges', 'overdraft',
  // Investment terms
  'investment', 'mutual fund', 'shares', 'stock', 'dividend', 'roi', 'return', 'equity', 'debt',
  'nav', 'aum', 'portfolio', 'fund value', 'investment amount',
  // Billing and invoicing
  'invoice', 'receipt', 'bill', 'statement', 'invoice number', 'bill amount', 'bill date',
  'amount due', 'amount paid', 'balance due', 'net amount',
  // Banking operations
  'cheque', 'draft', 'slip', 'passbook', 'bank statement', 'bank charges', 'bank details',
  'rtgs', 'neft', 'imps', 'net banking', 'verification', 'reconciliation',
  // Insurance terms
  'insurance', 'premium', 'claim', 'policy', 'coverage', 'sum insured', 'renewal', 'expiry',
  'insurance company', 'policy number', 'claim amount',
  // Income and salary
  'salary', 'wages', 'income', 'bonus', 'gratuity', 'pension', 'allowance', 'deductions',
  'gross', 'net', 'net salary', 'monthly income', 'annual income',
  // Budget and expenses
  'budget', 'expense', 'expenditure', 'monthly', 'quarterly', 'annual', 'yearly', 'cost',
  'utilities', 'electricity', 'water', 'rent', 'phone bill',
  // Financial metrics
  'profit', 'loss', 'revenue', 'income', 'liability', 'asset', 'equity', 'asset value',
  'net worth', 'liabilities', 'total assets', 'current assets', 'fixed assets',
];

const MEDICAL_WORDS = [
  // Blood tests
  'platelet count', 'hemoglobin', 'glucose', 'blood sugar', 'cholesterol', 'hdl', 'ldl',
  'triglycerides', 'creatinine', 'urea', 'uric acid', 'bilirubin', 'albumin', 'globulin',
  'ast', 'alt', 'sgpt', 'sgot', 'alkaline phosphatase', 'sodium', 'potassium', 'chloride',
  'calcium', 'phosphorus', 'magnesium', 'iron', 'zinc', 'copper', 'lead',
  // Complete blood count
  'wbc', 'rbc', 'white blood cell', 'red blood cell', 'monocytes', 'lymphocytes', 'neutrophils',
  'eosinophils', 'basophils', 'hematocrit', 'mcv', 'mch', 'mchc', 'blood cells',
  // Thyroid
  'tsh', 't3', 't4', 'thyroid', 'thyroid hormone', 'thyroid profile', 'thyroid function',
  't3 level', 't4 level', 'free t3', 'free t4', 'thyroid antibody',
  // Vital signs and measurements
  'bp', 'blood pressure', 'systolic', 'diastolic', 'heart rate', 'pulse', 'pulse rate',
  'respiration rate', 'temperature', 'fever', 'spo2', 'oxygen saturation', 'bmi', 'weight', 'height',
  // Diabetes related
  'hba1c', 'fasting glucose', 'random glucose', 'glucose tolerance', 'glucose tolerance test',
  'fasting blood sugar', 'fbs', 'rbs', 'postprandial', 'pp', 'diabetes', 'diabetic', 'blood sugar level',
  // Liver function
  'lfts', 'liver function test', 'liver', 'bilirubin', 'albumin', 'ast', 'alt',
  'alkaline phosphatase', 'ggt', 'liver enzyme', 'liver profile',
  // Kidney function
  'kft', 'kidney function test', 'creatinine', 'urea', 'bun', 'blood urea nitrogen',
  'kidney', 'renal', 'creatinine level', 'glomerular filtration', 'gfr',
  // Cardiac and heart
  'ecg', 'ekg', 'heart rate', 'cardiac', 'troponin', 'bnp', 'heart enzyme', 'ejection fraction',
  'ldh', 'cpk', 'lactic dehydrogenase', 'chest pain', 'arrhythmia',
  // Lipid profile
  'lipid profile', 'lipids', 'cholesterol level', 'triglyceride', 'hdl level', 'ldl level',
  'vldl', 'cholesterol ratio', 'lipid',
  // Coagulation
  'pt', 'inr', 'prothrombin time', 'aptt', 'bleeding time', 'clotting time',
  'blood clot', 'platelet function', 'coagulation', 'anticoagulant',
  // Vitamins and minerals
  'vitamin d', 'vitamin b12', 'vitamin a', 'vitamin c', 'vitamin e', 'vitamin b6',
  'folic acid', 'folate', 'calcium level', 'phosphorus level', 'magnesium level',
  // Infections and markers
  'hiv', 'hepatitis', 'typha', 'malaria', 'dengue', 'covid', 'antibody', 'antigen',
  'viral', 'bacterial', 'infection', 'infectious', 'culture', 'sensitivity',
  // Immunity
  'immunity', 'immune', 'immunoglobulin', 'igg', 'igm', 'iga', 'complement',
  'immune system', 'vaccine', 'vaccination', 'antibody level',
  // Allergy
  'allergy', 'allergic', 'allergen', 'ige', 'allergy test', 'sensitivity',
  // Hormones
  'hormone', 'hormonal', 'cortisol', 'testosterone', 'estrogen', 'progesterone',
  'insulin', 'glucagon', 'prolactin', 'growth hormone',
  // Pregnancy and gynecology
  'pregnancy', 'pregnant', 'hcg', 'beta hcg', 'gestational', 'ultrasound',
  'sonography', 'menstrual', 'menstruation', 'cycle', 'ovulation', 'zygosity',
  // Imaging
  'xray', 'x-ray', 'ultrasound', 'sonography', 'ct scan', 'mri', 'pet scan',
  'mammography', 'scan', 'imaging', 'radiograph',
  // Inflammatory and autoimmune
  'esr', 'crp', 'c-reactive protein', 'inflammation', 'inflammatory', 'rheumatoid factor',
  'ana', 'anti-nuclear antibody', 'lupus', 'rheumatism',
  // Cancer markers
  'psa', 'cea', 'ca19', 'ca125', 'ca199', 'tumor marker', 'cancer marker',
  'biopsy', 'malignancy', 'tumor', 'oncology',
  // Respiratory
  'lung function', 'spirometry', 'fev', 'sputum', 'chest xray', 'respiratory function',
  // Gastrointestinal
  'stool test', 'fecal', 'occult blood', 'h pylori', 'breath test', 'endoscopy',
  'colonoscopy', 'gastroenterology',
  // Urine tests
  'urine test', 'urinalysis', 'urine', 'protein in urine', 'glucose in urine',
  'nitrites', 'leukocyte esterase', 'urinary tract',
  // Other tests
  'eeg', 'emg', 'echo', 'echocardiogram', 'stress test', 'tmt', 'test tube',
];

const KEYWORD_ALIASES = {
  // Medical aliases
  platelet: 'platelet count',
  platelets: 'platelet count',
  plt: 'platelet count',
  haemoglobin: 'hemoglobin',
  hb: 'hemoglobin',
  sugar: 'blood sugar',
  glucose: 'glucose',
  bs: 'blood sugar',
  chol: 'cholesterol',
  tri: 'triglycerides',
  ldh: 'ldh',
  bp: 'blood pressure',
  pr: 'blood pressure',
  hr: 'heart rate',
  temp: 'temperature',
  thyroid: 'tsh',
  vit: 'vitamin d',
  wbc: 'wbc',
  rbc: 'rbc',
  cbc: 'wbc',
  ast: 'ast',
  alt: 'alt',
  esr: 'esr',
  crp: 'crp',
  hiv: 'hiv',
  covid: 'covid',
  insulin: 'insulin',
  gfr: 'kidney function',
  urine: 'urine test',
  stool: 'stool test',
  xray: 'xray',
  ct: 'ct scan',
  sono: 'ultrasound',
  pregnant: 'pregnancy',
  hcg: 'hcg',
  fbs: 'fasting blood sugar',
  rbs: 'random glucose',
  hba: 'hba1c',
  tsh: 'tsh',
  t3: 't3',
  t4: 't4',
  ap: 'alkaline phosphatase',
  albumin: 'albumin',
  protein: 'albumin',
  calcium: 'calcium',
  magnesium: 'magnesium',
  iron: 'iron',
  // Finance aliases
  balance: 'account balance',
  bal: 'account balance',
  acct: 'account balance',
  amt: 'total amount',
  amount: 'total amount',
  due: 'due date',
  duedate: 'due date',
  due_date: 'due date',
  pmt: 'payment',
  pay: 'payment',
  paid: 'payment',
  int: 'interest',
  principal: 'principal',
  prin: 'principal',
  loan_amt: 'loan',
  installment: 'emi',
  inst: 'emi',
  monthly: 'emi',
  gst_amt: 'gst',
  witholding: 'tds',
  invoice_no: 'invoice',
  inv: 'invoice',
  receipt_no: 'receipt',
  rec: 'receipt',
  trans: 'transaction',
  debit_amt: 'debit',
  credit_amt: 'credit',
  withdraw: 'withdrawal',
  deposit_amt: 'deposit',
  statement: 'bank statement',
  cheque_no: 'cheque',
  chq: 'cheque',
  credit_limit: 'credit limit',
  climit: 'credit limit',
  credit_score: 'credit score',
  cscore: 'credit score',
  cibil: 'credit score',
  overdraft: 'overdraft',
  od: 'overdraft',
  roi: 'return',
  return_on: 'return',
};

const KEYWORD_RANGES = {
  'platelet count': { normal: '150,000-400,000/mm³', easy: '1.5-4 lakh per mm³' },
  hemoglobin: { normal: 'M: 13.5-17.5, F: 12-15.5 g/dL', easy: 'Men higher than women' },
  glucose: { normal: '70-100 mg/dL (fasting)', easy: 'Below 100 is good when empty stomach' },
  'blood sugar': { normal: '70-100 mg/dL (fasting)', easy: 'Below 100 is good when empty stomach' },
  cholesterol: { normal: '< 200 mg/dL', easy: 'Below 200 is good' },
  hdl: { normal: '> 40 mg/dL (M), > 50 mg/dL (F)', easy: 'Higher is better' },
  ldl: { normal: '< 100 mg/dL', easy: 'Lower is better' },
  triglycerides: { normal: '< 150 mg/dL', easy: 'Below 150 is good' },
  'blood pressure': { normal: '< 120/80 mmHg', easy: 'Below 120/80 is normal' },
  tsh: { normal: '0.4-4.0 mIU/L', easy: 'In this range is normal thyroid' },
  't3': { normal: '2.3-4.2 pg/mL', easy: 'In this range is normal' },
  't4': { normal: '4.5-12 mcg/dL', easy: 'In this range is normal' },
  'vitamin d': { normal: '> 20 ng/mL', easy: 'Above 20 is good, 30+ is better' },
  'vitamin b12': { normal: '200-900 pg/mL', easy: 'In this range is normal' },
  'vitamin a': { normal: '600-900 mcg', easy: 'In this range is safe' },
  'folic acid': { normal: '> 5.4 ng/mL', easy: 'Above 5.4 is good' },
  creatinine: { normal: '0.7-1.3 mg/dL', easy: 'Shows kidney function' },
  urea: { normal: '7-18 mg/dL', easy: 'In this range is good' },
  'uric acid': { normal: 'M: 3.5-7.2, F: 2.6-6 mg/dL', easy: 'Men slightly higher than women' },
  'wbc': { normal: '4,500-11,000/mcL', easy: '4.5-11 thousand is normal' },
  'rbc': { normal: 'M: 4.5-5.5, F: 4-5.2 million/mcL', easy: 'Shows oxygen carrying cells' },
  'ast': { normal: '10-40 IU/L', easy: 'Below 40 is normal' },
  'alt': { normal: '7-56 IU/L', easy: 'Below 56 is normal' },
  'sgpt': { normal: '7-56 IU/L', easy: 'Below 56 is normal' },
  'sgot': { normal: '10-40 IU/L', easy: 'Below 40 is normal' },
  'esr': { normal: 'M: < 20, F: < 30 mm/hr', easy: 'Low is good, high means inflammation' },
  'crp': { normal: '< 3 mg/L', easy: 'Below 3 means no inflammation' },
  'hba1c': { normal: '< 5.7%', easy: 'Below 5.7 is good, 5.7-6.4 is prediabetes' },
  'heart rate': { normal: '60-100 bpm', easy: 'Normal resting heart beat' },
  'temperature': { normal: '98.6°F (37°C)', easy: 'Normal body heat' },
  'spo2': { normal: '95-100%', easy: 'Oxygen level in blood' },
  'sodium': { normal: '135-145 mEq/L', easy: 'In this range is normal' },
  'potassium': { normal: '3.5-5.0 mEq/L', easy: 'In this range is normal' },
  'calcium': { normal: '8.5-10.5 mg/dL', easy: 'In this range is normal' },
  'phosphorus': { normal: '2.5-4.5 mg/dL', easy: 'In this range is normal' },
  'magnesium': { normal: '1.7-2.2 mg/dL', easy: 'In this range is normal' },
  'iron': { normal: 'M: 60-170, F: 50-170 mcg/dL', easy: 'Low iron causes tiredness' },
  'zinc': { normal: '60-120 mcg/dL', easy: 'In this range is normal' },
  'copper': { normal: '70-150 mcg/dL', easy: 'In this range is normal' },
  'bmi': { normal: '18.5-24.9 kg/m²', easy: '18.5-24.9 is normal weight' },
  'albumin': { normal: '3.4-5.4 g/dL', easy: 'Shows liver and nutritional health' },
  'globulin': { normal: '2.3-3.5 g/dL', easy: 'Part of blood proteins' },
  'bilirubin': { normal: '0.1-1.2 mg/dL', easy: 'High means liver problem' },
  'alkaline phosphatase': { normal: '30-120 IU/L', easy: 'Shows bone and liver health' },
  'inr': { normal: '0.8-1.1', easy: 'Shows blood clotting ability' },
  'pt': { normal: '11-13.5 seconds', easy: 'Shows blood clotting time' },
  'aptt': { normal: '25-35 seconds', easy: 'Shows blood clotting time' },
  'gfr': { normal: '> 60 mL/min', easy: 'Shows kidney filtering ability' },
  'ldh': { normal: '140-280 IU/L', easy: 'High may indicate tissue damage' },
  'troponin': { normal: '< 0.04 ng/mL', easy: 'High means possible heart damage' },
  'bnp': { normal: '< 100 pg/mL', easy: 'High means possible heart stress' },
  'cpk': { normal: '30-200 IU/L', easy: 'High means muscle or heart damage' },
  'hiv': { normal: 'Negative', easy: 'Negative is good' },
  'hepatitis': { normal: 'Negative', easy: 'Negative is good' },
  'pregnancy': { normal: 'Beta HCG > 5 mIU/mL', easy: 'Rising HCG indicates healthy pregnancy' },
  'hcg': { normal: '> 5 mIU/mL', easy: 'Positive in pregnancy' },
  'ecg': { normal: 'Normal sinus rhythm', easy: 'Regular heart pattern' },
  'covid': { normal: 'Negative', easy: 'Negative is good' },
  'account balance': { normal: 'Depends on goals', easy: 'Should be positive, higher is safer' },
  'available balance': { normal: 'Check monthly expenses', easy: 'Balance for 3-6 months is safe' },
  interest: { normal: 'Higher for savings, lower for loans', easy: 'Savings: 6-8% good, Loans: <12% good' },
  emi: { normal: '< 40-50% of income', easy: 'Should not be more than half your salary' },
  'minimum due': { normal: 'Pay full amount if possible', easy: 'Paying only minimum increases interest' },
  outstanding: { normal: 'Zero is best', easy: 'Try to keep this as low as possible' },
  'credit limit': { normal: 'Based on income', easy: 'Credit limit based on salary' },
  'credit score': { normal: '> 750', easy: 'Above 750 is good, above 900 is excellent' },
  'closing balance': { normal: 'Positive is good', easy: 'Money available at month end' },
  'opening balance': { normal: 'Positive is good', easy: 'Money at start of statement' },
  'due date': { normal: 'Pay before this', easy: 'Last day to pay without penalty' },
  'gst': { normal: 'Tax percentage', easy: '5-28% depending on product' },
  'tds': { normal: 'Tax deducted', easy: 'Income tax deducted at source' },
  'principal': { normal: 'Loan amount', easy: 'Original amount borrowed' },
  'payment': { normal: 'Monthly or on due date', easy: 'Money to pay on schedule' },
  'deposit': { normal: 'Money added', easy: 'Funds added to account' },
  'withdrawal': { normal: 'Money removed', easy: 'Funds taken from account' },
  'transaction': { normal: 'Any money movement', easy: 'Any debit or credit entry' },
  'invoice': { normal: 'Bill number', easy: 'Reference for payment' },
  'cheque': { normal: 'Check number', easy: 'Identifies specific check' },
  'salary': { normal: 'Monthly income', easy: 'Income from employment' },
  'bonus': { normal: 'Additional income', easy: 'Extra money beyond salary' },
  'overdraft': { normal: 'Beyond account balance', easy: 'Borrowed money from bank' },
  'roi': { normal: 'Investment returns', easy: 'Profit or interest earned' },
};

const KEYWORD_FALLBACK_MEANINGS = {
  'platelet count': 'Platelets are tiny cells that help your blood clot and stop bleeding when you get hurt. Normal range is 1.5-4 lakh per mm³. Low platelets mean your blood may not clot properly, high means risk of clots.',
  platelet: 'Platelets are tiny cells that help your blood clot and stop bleeding when you get hurt. Normal range is 1.5-4 lakh per mm³. Low platelets mean your blood may not clot properly, high means risk of clots.',
  hemoglobin: 'Hemoglobin is a protein that carries oxygen throughout your body. Normal is 13.5-17.5 for men and 12-15.5 for women in g/dL. Low hemoglobin causes weakness and tiredness, high can stress your heart.',
  glucose: 'Glucose is sugar in your blood that gives your body energy. Normal fasting is 70-100 mg/dL (when empty stomach). Below 70 means low blood sugar (weakness), above 100 means high blood sugar (diabetes risk).',
  'blood sugar': 'Blood sugar is glucose in your blood that gives energy. Normal fasting is 70-100 mg/dL. Below 70 means low blood sugar (weakness and dizziness), above 100 means high blood sugar (diabetes risk).',
  cholesterol: 'Cholesterol is a type of fat in your blood that helps make hormones but too much can block blood vessels. Normal is below 200 mg/dL. High cholesterol increases risk of heart attack and stroke.',
  hdl: 'HDL is good cholesterol that clears bad cholesterol from your blood. Normal is above 40 for men and 50 for women in mg/dL. The higher this number, the better protected your heart is.',
  ldl: 'LDL is bad cholesterol that can stick to blood vessel walls and narrow them. Normal is below 100 mg/dL. Higher levels mean greater risk of heart disease and need for lifestyle changes.',
  triglycerides: 'Triglycerides are a type of fat in your blood that your body uses for energy. Normal is below 150 mg/dL. High levels combined with low HDL increase heart disease risk significantly.',
  'blood pressure': 'Blood pressure shows the force of blood against your vessel walls (systolic/diastolic). Normal is below 120/80 mmHg. High blood pressure can damage your heart and kidneys over time.',
  tsh: 'TSH controls your thyroid which manages metabolism and energy. Normal range is 0.4-4.0 mIU/L. Too low means overactive thyroid (thin, nervous), too high means underactive (tired, weight gain).',
  't3': 'T3 is thyroid hormone that affects how fast your body burns calories and energy. Normal range is 2.3-4.2 pg/mL. Low T3 causes tiredness and weight gain, high causes anxiety and fast heartbeat.',
  't4': 'T4 is another thyroid hormone controlling metabolism. Normal is 4.5-12 mcg/dL. Low T4 causes slowness and weight gain, high T4 causes nervousness and weight loss.',
  'vitamin d': 'Vitamin D is made by sun exposure and helps absorb calcium for strong bones. Normal is above 20 ng/mL (sufficient), 30+ is better. Low vitamin D causes weak bones, tiredness, and poor immunity.',
  'vitamin b12': 'Vitamin B12 helps your nerves and red blood cells work properly. Normal range is 200-900 pg/mL. Low B12 causes weakness, numbness, and memory problems that can be serious if untreated.',
  'vitamin a': 'Vitamin A helps your eyes, skin and immune system work properly. Normal range is 600-900 mcg. Very low or very high levels both cause health problems.',
  'folic acid': 'Folic acid helps make DNA and blood cells. Normal is above 5.4 ng/mL. Low folate causes weakness, memory problems and pregnancy issues.',
  creatinine: 'Creatinine is a waste product from muscles that kidneys filter out. Normal is 0.7-1.3 mg/dL. High creatinine suggests kidney problems and needs investigation with your doctor.',
  urea: 'Urea is a waste product from protein breakdown that kidneys remove. Normal range is 7-18 mg/dL. High urea can indicate kidney stress or dehydration and needs follow-up.',
  'uric acid': 'Uric acid is produced when body breaks down purines. Normal is 3.5-7.2 for men and 2.6-6 for women in mg/dL. High levels increase gout risk (joint pain) and kidney stone risk.',
  'wbc': 'WBC (white blood cells) fight infections in your body. Normal is 4.5-11 thousand per microliter. Low WBC means weak immunity, high means infection or inflammation.',
  'rbc': 'RBC (red blood cells) carry oxygen throughout your body. Normal is 4.5-5.5 for men and 4-5.2 for women in millions per microliter. Low RBC causes weakness and shortness of breath.',
  'ast': 'AST is an enzyme from liver and muscles. Normal is below 40 IU/L. High AST suggests liver damage or muscle injury and needs investigation.',
  'alt': 'ALT is an enzyme mainly from liver. Normal is below 56 IU/L. High ALT suggests liver disease and needs doctor consultation.',
  'sgpt': 'SGPT (same as ALT) is an enzyme mainly from liver. Normal is below 56 IU/L. High SGPT suggests liver damage and needs follow-up.',
  'sgot': 'SGOT (same as AST) is an enzyme from liver and muscles. Normal is below 40 IU/L. High SGOT suggests liver or muscle problems.',
  'esr': 'ESR (erythrocyte sedimentation rate) shows inflammation in your body. Normal is below 20 for men and 30 for women in mm/hr. High ESR indicates inflammation or infection.',
  'crp': 'CRP (C-reactive protein) shows inflammation marker. Normal is below 3 mg/L. High CRP indicates inflammation or infection in your body.',
  'hba1c': 'HbA1c shows your average blood sugar over 3 months. Normal is below 5.7%, between 5.7-6.4% means prediabetes, above 6.5% means diabetes.',
  'heart rate': 'Heart rate is how many times your heart beats per minute. Normal resting is 60-100 bpm. Very high or very low rates need doctor check.',
  'temperature': 'Body temperature shows if you have fever. Normal is 98.6°F (37°C). Above 100.4°F means fever and possible infection.',
  'spo2': 'SPO2 (oxygen saturation) shows oxygen in your blood. Normal is 95-100%. Below 95% means low oxygen and difficulty breathing.',
  'sodium': 'Sodium is a mineral controlling body fluid balance. Normal is 135-145 mEq/L. Too low or too high can cause confusion and serious problems.',
  'potassium': 'Potassium helps heart and muscles work properly. Normal is 3.5-5.0 mEq/L. Too low causes weakness, too high is dangerous for heart.',
  'calcium': 'Calcium makes bones strong and helps muscles work. Normal is 8.5-10.5 mg/dL. Low calcium weakens bones, high calcium can cause kidney stones.',
  'phosphorus': 'Phosphorus works with calcium to build strong bones. Normal is 2.5-4.5 mg/dL. Abnormal levels can weaken bones.',
  'magnesium': 'Magnesium helps muscles relax and nerves work. Normal is 1.7-2.2 mg/dL. Low magnesium causes muscle cramps and weakness.',
  'iron': 'Iron carries oxygen in your blood. Normal is 60-170 for men and 50-170 for women in mcg/dL. Low iron causes tiredness and weakness (anemia).',
  'zinc': 'Zinc boosts immunity and helps wounds heal. Normal is 60-120 mcg/dL. Low zinc weakens immunity and slows healing.',
  'copper': 'Copper helps make red blood cells and build bones. Normal is 70-150 mcg/dL. Abnormal levels are rare but affect energy.',
  'albumin': 'Albumin is a protein made by liver showing nutritional health. Normal is 3.4-5.4 g/dL. Low albumin suggests malnutrition or liver disease.',
  'globulin': 'Globulin are proteins that fight infections. Normal is 2.3-3.5 g/dL. Abnormal levels can indicate infection or immune disease.',
  'bilirubin': 'Bilirubin is a breakdown product from red blood cells. Normal is 0.1-1.2 mg/dL. High bilirubin causes jaundice (yellow skin) and suggests liver problem.',
  'alkaline phosphatase': 'Alkaline phosphatase is an enzyme from bones and liver. Normal is 30-120 IU/L. High levels suggest bone disease or liver problem.',
  'inr': 'INR (international normalized ratio) measures blood clotting ability. Normal is 0.8-1.1. Higher INR means blood clots slower (good for some, risky for others).',
  'aptt': 'APTT measures blood clotting time. Normal is 25-35 seconds. Abnormal APTT suggests bleeding disorder or blood clot problem.',
  'gfr': 'GFR (glomerular filtration rate) shows how well kidneys filter waste. Normal is above 60 mL/min. Below 60 suggests kidney disease stages.',
  'ldh': 'LDH is an enzyme released when tissues are damaged. Normal is 140-280 IU/L. High LDH suggests heart damage, liver disease or blood disorder.',
  'troponin': 'Troponin is a heart protein released during heart attack. Normal is below 0.04 ng/mL. High troponin indicates possible heart damage.',
  'bnp': 'BNP (B-type natriuretic peptide) indicates heart stress. Normal is below 100 pg/mL. High BNP suggests heart failure or strain.',
  'cpk': 'CPK is an enzyme from muscles and heart. Normal is 30-200 IU/L. High CPK suggests muscle damage or heart problems.',
  'ecg': 'ECG (electrocardiogram) records heart electrical activity. Normal shows regular sinus rhythm. Abnormal patterns indicate heart disease.',
  'hiv': 'HIV is virus causing AIDS. Normal result is negative (no HIV). Positive result needs confirmation and doctor treatment.',
  'hepatitis': 'Hepatitis is liver inflammation from virus infection. Normal is negative (no hepatitis). Positive result needs doctor consultation.',
  'covid': 'COVID is coronavirus causing respiratory disease. Normal is negative (no virus). Positive means active COVID infection.',
  'hcg': 'HCG (human chorionic gonadotropin) hormone increases in pregnancy. Above 5 mIU/mL indicates pregnancy. High HCG confirms healthy pregnancy.',
  'pregnancy': 'Pregnancy confirmed by HCG hormone above 5 mIU/mL. Rising HCG over weeks confirms healthy pregnancy. Ultrasound confirms fetal development.',
  'microalbumin': 'Microalbumin in urine indicates early kidney damage. Normal is negative (no microalbumin). Positive suggests diabetes or high blood pressure damage.',
  'urine test': 'Urine test checks for infections, kidney problems and diabetes. Normal shows no glucose, protein or blood. Abnormal results indicate disease.',
  'stool test': 'Stool test checks for infections and intestinal bleeding. Normal shows no blood, no parasites. Positive results indicate infection or bleeding.',
  'xray': 'X-ray uses radiation to take pictures of bones and organs. Normal shows clear images without abnormalities. Findings guide treatment.',
  'ultrasound': 'Ultrasound uses sound waves to see organs and babies. Normal shows proper size and structure. Abnormalities guide doctor decisions.',
  'ct scan': 'CT scan takes detailed cross-section pictures of organs. Normal shows no abnormal masses or bleeding. Helps diagnose serious conditions.',
  'mri': 'MRI uses magnets to create detailed body images. Normal shows proper structure and no abnormalities. Detects tissues problems clearly.',
  'account balance': 'Account balance is total money currently in your bank account. Healthy balance depends on your monthly expenses. Ideally keep 3-6 months of expenses saved.',
  'available balance': 'Available balance is money you can spend right now from your account. Keep at least 3-6 months of living expenses as emergency fund.',
  interest: 'Interest is extra money earned on savings or paid on loans. For savings, 6-8% is good. For loans, under 12% is good.',
  emi: 'EMI (equal monthly installment) is fixed payment for a loan spread over months. Should not exceed 40-50% of monthly income.',
  'minimum due': 'Minimum due is smallest amount you must pay on credit card. Paying only minimum increases interest charges heavily.',
  outstanding: 'Outstanding is total money you owe on credit card or loan. Zero is best. Keep low to avoid high interest charges.',
  'credit limit': 'Credit limit is maximum money you can borrow on credit card. Based on your income and credit score. Higher scores get higher limits.',
  'credit score': 'Credit score shows your borrowing history (0-900). Above 750 is good, above 900 is excellent. Affects loan approval and interest rates.',
  'closing balance': 'Closing balance is money in account at end of month. Positive is good. Used to plan next month budget.',
  'opening balance': 'Opening balance is money in account at start of month. Shows where you started from. Helps track spending.',
  'due date': 'Due date is last day to pay bill without penalty. Mark calendar to avoid late payment charges. Pay before this date.',
  'gst': 'GST (goods and services tax) is tax added on products. Rates are 5%, 12%, 18% or 28% depending on item. Included in final price.',
  'tds': 'TDS (tax deducted at source) is income tax deducted from salary. Automatically deducted by employer. Get refund if TDS is more than actual tax.',
  'principal': 'Principal is original amount you borrowed in a loan. Interest is charged on principal. Must be repaid completely.',
  'payment': 'Payment is money you give on bill or loan due date. Should be on time to avoid penalties. Receipt proves payment.',
  'deposit': 'Deposit is money added into your bank account. From salary, interest earnings or transfers. Balance increases.',
  'withdrawal': 'Withdrawal is money taken out from bank account. ATM, check or transfer. Balance decreases.',
  'transaction': 'Transaction is any money movement in account. Deposit, withdrawal, payment or transfer. Each transaction is recorded.',
  'invoice': 'Invoice is bill number for purchase or service. Reference number for payment tracking. Keep for records.',
  'cheque': 'Cheque is paper payment method from bank account. Cheque number identifies it. Must have sufficient balance.',
  'salary': 'Salary is monthly income from employment. Fixed amount paid regularly. Used to calculate budget.',
  'bonus': 'Bonus is extra money beyond salary. Usually annual or performance based. Unexpected income boost.',
  'overdraft': 'Overdraft is borrowing from bank beyond your balance. Charged with high interest. Avoid overdraft if possible.',
  'roi': 'ROI (return on investment) is profit earned from investment. Calculated as percentage. Higher ROI is better but riskier.',
  'investment': 'Investment is money put into mutual funds, stocks or bonds. Earns returns over time. Involves some risk.',
  'mutual fund': 'Mutual fund pools investor money to buy stocks/bonds. Professional manager decides purchases. Returns vary yearly.',
  'dividend': 'Dividend is profit shared by company with its shareholders. Additional income from your shares. Received periodically.',
  'expenses': 'Expenses are money spent on daily needs like food, rent. Track monthly for budgeting. Should be less than income.',
  'budget': 'Budget is planned money allocation for month. Shows income and expenses. Helps control spending.',
  'loan': 'Loan is borrowed money from bank or lender. Must be repaid with interest. Get approval based on credit score.',
  'transfer': 'Transfer is sending money from your account to another. Can be to person, bill payment or investment. Instant or 1-2 days.',
  'statement': 'Statement is monthly record of all account transactions. Shows deposits, withdrawals and balance. Keep for records.',
  'charges': 'Charges are bank fees for services. ATM fee, overdraft fee, service fee. Review to reduce unnecessary charges.',
};

const normalizeText = (value) => value.toLowerCase().replace(/[^a-z0-9\s.%/-]/g, ' ');

const pickDomainKeywords = (text, dictionary) => {
  const lower = normalizeText(text);
  const found = new Set();

  dictionary.forEach((kw) => {
    if (lower.includes(kw)) found.add(kw);
  });

  Object.entries(KEYWORD_ALIASES).forEach(([alias, canonical]) => {
    if (dictionary.includes(canonical) && lower.includes(alias)) {
      found.add(canonical);
    }
  });

  return Array.from(found);
};

const buildKeywordSummary = (text) => {
  const finance = pickDomainKeywords(text, FINANCE_WORDS);
  const medical = pickDomainKeywords(text, MEDICAL_WORDS);

  const domain = finance.length >= medical.length ? 'Finance' : 'Medical';
  const keywords = (domain === 'Finance' ? finance : medical).slice(0, 8);

  return {
    domain,
    keywords,
    financeCount: finance.length,
    medicalCount: medical.length,
  };
};

const extractKeywordSnippets = (text, keywords) => {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const matched = lines.filter((line) => {
    const lower = line.toLowerCase();
    return keywords.some((kw) => lower.includes(kw.toLowerCase())) || /(mg\/dl|g\/dl|mmhg|inr|rs\.?|₹|%)/i.test(line);
  });

  return matched.slice(0, 8);
};

const hasDevanagari = (value) => /[\u0900-\u097F]/.test(String(value || ''));

const OCR_TIMEOUT_MS = 90000;

const withTimeout = (promise, ms, timeoutMessage) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(timeoutMessage)), ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
};

const fileToDataUrl = (inputFile) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(inputFile);
  });

const fallbackSummary = (domain, keywords, outputLanguage = 'english') => {
  const top = keywords.slice(0, 6);
  const kText = top.length ? top.join(', ') : 'key report values';
  
  const keywordDefs = top.map((kw) => {
    const lowerKw = kw.toLowerCase();
    const rangeInfo = KEYWORD_RANGES[lowerKw]?.normal;
    const englishMeaning = KEYWORD_FALLBACK_MEANINGS[lowerKw]
      || `${kw} is an important term in your ${domain.toLowerCase()} report. ${rangeInfo ? `Normal range is ${rangeInfo}.` : 'Normal healthy level depends on your situation.'} Compare with previous reports and ask doctor/banker for safe range.`;
    const hindiMeaning = `${kw} आपकी ${domain === 'Medical' ? 'मेडिकल' : 'फाइनेंस'} रिपोर्ट का महत्वपूर्ण भाग है। ${rangeInfo ? `इसका सामान्य दायरा ${rangeInfo} माना जाता है।` : 'इसकी सुरक्षित वैल्यू आपकी स्थिति पर निर्भर करती है।'} ${domain === 'Medical' ? 'अगर वैल्यू बहुत कम या ज्यादा हो तो डॉक्टर से सलाह लें।' : 'अगर वैल्यू असामान्य लगे तो बैंक स्टेटमेंट दोबारा जांचें।'}`;
    return {
      keyword: kw,
      meaning: outputLanguage === 'hindi' ? hindiMeaning : englishMeaning,
    };
  });
  
  const isHindi = outputLanguage === 'hindi';

  return {
    easySummary: isHindi
      ? `यह एक ${domain === 'Medical' ? 'मेडिकल' : 'फाइनेंस'} दस्तावेज़ है। इसमें मुख्य बिंदु हैं: ${kText}। हर वैल्यू को उसके सामान्य दायरे से मिलाकर समझना जरूरी है।`
      : `This is a ${domain.toLowerCase()} document. Main topics are: ${kText}. Each has a normal/healthy range that helps doctors/bankers understand if you are okay or need to take action.`,
    keywordDefinitions: keywordDefs,
    advice:
      isHindi
        ? (domain === 'Medical'
          ? `1. जो वैल्यू सामान्य दायरे से बाहर हों, उनके लिए 1-2 हफ्ते में डॉक्टर से सलाह लें। 2. पुरानी रिपोर्ट संभालकर रखें ताकि ट्रेंड तुलना हो सके। 3. दवा, डाइट और एक्सरसाइज की सलाह नियमित रूप से फॉलो करें। 4. डॉक्टर के कहने पर फॉलो-अप टेस्ट कराकर प्रगति जांचें।`
          : `1. ब्याज दर ज्यादा हो तो बेहतर बैंक या योजना की तुलना करें। 2. आउटस्टैंडिंग राशि कम रखें, वरना अतिरिक्त चार्ज बढ़ते हैं। 3. ईएमआई को मासिक आय के 40-50% के अंदर रखें। 4. हर महीने स्टेटमेंट में सभी चार्ज और कटौतियां जांचें।`)
        : (domain === 'Medical'
          ? `1. For any abnormal value (outside normal range), consult your doctor within 1-2 weeks. 2. Keep a file of all your previous reports to track if values are improving or worsening. 3. Follow doctor's medicine, diet and exercise advice strictly. 4. Retest when doctor advises to check if treatment is working.`
          : `1. Check if you are paying more interest than needed - switch banks if rate is too high. 2. Avoid keeping large outstanding balance on credit card as interest piles up quickly. 3. EMI should not exceed 40-50% of your monthly salary - if higher, reduce loan amount. 4. Review all charges and deductions monthly with your bank statement to catch errors or fraud.`),
  };
};

const extractTextFromPdf = async (file) => {
  const buffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: buffer }).promise;
  let combined = '';

  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((it) => it.str).join(' ');
    combined += `\n${pageText}`;
  }

  return combined.trim();
};

const extractTextWithVisionFallback = async (inputFile, outputLanguage = 'english') => {
  const imageDataUrl = await fileToDataUrl(inputFile);
  const response = await apiFetch('/api/ocr-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageDataUrl, outputLanguage }),
  });

  const raw = await response.text();
  let data = {};
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = { error: raw };
    }
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Vision OCR fallback failed.');
  }

  return String(data?.text || '').trim();
};

const extractTextFromImage = async (inputFile, outputLanguage, onProgress) => {
  const ocrLanguage = outputLanguage === 'hindi' ? 'hin+eng' : 'eng';

  try {
    const { data } = await withTimeout(
      recognize(inputFile, ocrLanguage, {
        logger: (m) => {
          if (!m?.status) return;

          if (m.status.includes('loading tesseract core')) onProgress(12);
          if (m.status.includes('initializing tesseract')) onProgress(20);
          if (m.status.includes('loading language traineddata')) onProgress(32);
          if (m.status.includes('initializing api')) onProgress(45);
          if (m.status === 'recognizing text' && typeof m.progress === 'number') {
            onProgress(Math.max(50, Math.round(50 + m.progress * 35)));
          }
        },
      }),
      OCR_TIMEOUT_MS,
      'OCR timed out while reading image. Please try a clearer image.'
    );

    const extracted = String(data?.text || '').trim();
    if (extracted) return extracted;
    throw new Error('No text detected by OCR engine.');
  } catch {
    onProgress(70);
    // Fallback to vision OCR via backend when browser OCR stalls/fails.
    return extractTextWithVisionFallback(inputFile, outputLanguage);
  }
};

const askAiForCrispSummary = async (domain, keywords, snippets, outputLanguage = 'english') => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const targetLanguage = outputLanguage === 'hindi' ? 'Hindi' : 'English';
    const rangeHints = keywords.map(kw => `${kw}: ${KEYWORD_RANGES[kw]?.normal || 'varies'}`).join(' | ');

    const prompt = [
      'You are a document explainer for non-technical users using VERY SIMPLE language.',
      `Document type: ${domain}`,
      `Output language must be: ${targetLanguage}`,
      `Allowed domain keywords only: ${keywords.join(', ') || 'none'}`,
      `Normal healthy ranges: ${rangeHints}`,
      `Important extracted lines: ${snippets.join(' | ') || 'none'}`,
      '',
      'Return ONLY valid JSON in this exact format:',
      '{"easySummary":"2-3 simple lines","keywordDefinitions":[{"keyword":"...","meaning":"3-4 line explanation including normal range"}],"advice":"3-4 line practical next steps"}',
      'Rules:',
      '- easySummary must be 2-3 short lines only',
      '- keywordDefinitions MUST include 3 to 6 keywords from allowed list',
      '- EACH DEFINITION MUST BE 3-4 LINES including normal range info',
      '- Use only the selected output language',
      '- If language is Hindi, write ONLY in Hindi Devanagari script (no Hinglish, no Roman Hindi)',
      '- In Hindi mode, do not use Latin letters except units like mg/dL, %, mmHg',
      '- If language is English, write in very basic easy English',
      '- Include "Normal range is..." or "Healthy level..." in each definition',
      '- Explain what the number means in real life (high=danger or good, low=problem or good)',
      '- do not include generic words like report, test, result, issue, term',
      '- advice must be exactly 3-4 lines with clear action steps',
      '- advice should mention if values are normal or need attention',
      '',
      'Now generate JSON with 3-4 line definitions that include normal ranges.'
    ].join('\n');

    const response = await apiFetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ message: prompt }),
    });

    const raw = await response.text();
    let data = {};
    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch {
        data = { error: raw };
      }
    }

    if (!response.ok) {
      throw new Error(data?.error || 'Failed to summarize document.');
    }

    const content = data.reply || '';
    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      throw new Error('AI returned non-JSON response.');
    }

    const parsed = JSON.parse(content.slice(jsonStart, jsonEnd + 1));
    const easySummary = parsed?.easySummary?.trim();
    const defs = Array.isArray(parsed?.keywordDefinitions) ? parsed.keywordDefinitions : [];
    const advice = String(parsed?.advice || '').trim();

    if (!easySummary) {
      throw new Error('AI response missing easySummary.');
    }

    const result = {
      easySummary,
      keywordDefinitions: defs
        .map((item) => ({
          keyword: String(item?.keyword || '').trim(),
          meaning: String(item?.meaning || '').trim(),
        }))
        .filter((item) => item.keyword && item.meaning)
        .slice(0, 6),
      advice,
    };

    if (outputLanguage === 'hindi') {
      const defsText = result.keywordDefinitions.map((d) => d.meaning).join(' ');
      const hasHindiOutput = hasDevanagari(result.easySummary) && hasDevanagari(result.advice) && hasDevanagari(defsText);
      if (!hasHindiOutput) {
        return fallbackSummary(domain, keywords, 'hindi');
      }
    }

    return result;
  } finally {
    clearTimeout(timeout);
  }
};

const Scanner = () => {
  const [file, setFile] = useState(null);
  const [outputLanguage, setOutputLanguage] = useState('english');
  const [previewUrl, setPreviewUrl] = useState('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const isPdf = selected.type === 'application/pdf' || selected.name.toLowerCase().endsWith('.pdf');
    const isImage = selected.type.startsWith('image/');

    if (!isPdf && !isImage) {
      setError('Please upload PDF or image (JPG/PNG/WEBP).');
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(selected);
    setResult(null);
    setError('');
    setProgress(0);
    setPreviewUrl(isImage ? URL.createObjectURL(selected) : '');
  };

  const processDocument = async () => {
    if (!file) {
      setError('Please choose a document first.');
      return;
    }

    try {
      setProcessing(true);
      setError('');
      setProgress(5);

      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      let text = '';

      if (isPdf) {
        text = await extractTextFromPdf(file);
        setProgress(60);
      } else {
        text = await extractTextFromImage(file, outputLanguage, (value) => setProgress((prev) => Math.max(prev, value)));
        setProgress((prev) => Math.max(prev, 75));
      }

      if (!text) {
        setError('No readable text found. For scanned PDFs, try a clearer source or image file.');
        setResult(null);
        return;
      }

      const keywordData = buildKeywordSummary(text);
      const snippets = extractKeywordSnippets(text, keywordData.keywords);
      setProgress(75);
      let aiSummary;
      try {
        aiSummary = await askAiForCrispSummary(keywordData.domain, keywordData.keywords, snippets, outputLanguage);
      } catch {
        aiSummary = fallbackSummary(keywordData.domain, keywordData.keywords, outputLanguage);
      }
      setProgress(100);

      setResult({
        domain: keywordData.domain,
        keywords: keywordData.keywords,
        outputLanguage,
        easySummary: aiSummary.easySummary,
        keywordDefinitions: aiSummary.keywordDefinitions,
        advice: aiSummary.advice || fallbackSummary(keywordData.domain, keywordData.keywords, outputLanguage).advice,
        text,
        fileName: file.name,
      });
    } catch (scanError) {
      const message = scanError?.name === 'AbortError'
        ? 'Request timed out. Please try again.'
        : scanError.message;
      setError(`Processing failed: ${message}`);
      setResult(null);
    } finally {
      setProcessing(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setProcessing(false);
    setProgress(0);
    setError('');
    setResult(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="fade-in" style={styles.container}>
      <header style={{ marginBottom: '32px' }}>
        <h1 className="h2" style={{ color: 'var(--text-dark)' }}>Document Simplifier</h1>
        <p className="subtext">Upload PDF or image and get crisp keyword-based finance/medical summary</p>
      </header>

      {!result && (
        <div style={styles.uploadArea} className="hover-card">
          <div style={styles.iconCircle}>
            <Upload size={32} color="var(--primary)" />
          </div>
          <h3 style={{ marginTop: '16px', marginBottom: '8px' }}>Upload PDF or image</h3>
          <p className="subtext" style={{ textAlign: 'center', maxWidth: '320px' }}>
            Supported: PDF, JPG, PNG, WEBP
          </p>

          <div style={styles.languageSelector}>
            <button
              type="button"
              onClick={() => setOutputLanguage('english')}
              style={{
                ...styles.languageBox,
                ...(outputLanguage === 'english' ? styles.languageBoxActive : {}),
              }}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setOutputLanguage('hindi')}
              style={{
                ...styles.languageBox,
                ...(outputLanguage === 'hindi' ? styles.languageBoxActive : {}),
              }}
            >
              Hindi
            </button>
          </div>
          <p className="subtext" style={{ marginTop: '10px', textAlign: 'center' }}>
            Output medium: {outputLanguage === 'hindi' ? 'Hindi' : 'English'} | OCR mode: {outputLanguage === 'hindi' ? 'Hindi + English' : 'English'}
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <div style={styles.actionsRow}>
            <button className="btn btn-secondary" onClick={() => inputRef.current?.click()}>
              <Upload size={16} /> Choose Document
            </button>
            <button className="btn btn-primary" onClick={processDocument} disabled={!file || processing}>
              <ScanText size={16} /> {processing ? 'Processing...' : 'Analyze Document'}
            </button>
          </div>

          {file && <p className="subtext" style={{ marginTop: '12px' }}>Selected: {file.name}</p>}
          {!!previewUrl && <img src={previewUrl} alt="Preview" style={styles.previewImage} />}

          {processing && (
            <div style={{ marginTop: '20px' }}>
              <p style={{ color: 'var(--primary)', textAlign: 'center' }}>Processing... {progress}%</p>
            </div>
          )}

          {!!error && <p style={styles.errorText}>{error}</p>}
        </div>
      )}

      {result && (
        <div style={styles.resultCard} className="fade-in">
          <div style={styles.resultHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileText size={24} color="var(--primary)" />
              <h3 style={{ fontSize: '1.15rem' }}>{result.fileName}</h3>
            </div>
            <span className="subtext">Detected Domain: {result.domain} | Output: {result.outputLanguage === 'hindi' ? 'Hindi' : 'English'}</span>
          </div>

          <div style={styles.summaryBox}>
            <h4 style={{ marginBottom: '8px', color: 'var(--primary-dark)' }}>Crisp Summary:</h4>
            <p style={styles.summaryText}>{result.easySummary}</p>
          </div>

          <div style={styles.highlightsBox}>
            <h4 style={{ marginBottom: '12px' }}>Keyword Meanings:</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {(result.keywordDefinitions?.length ? result.keywordDefinitions : [{ keyword: 'N/A', meaning: 'No keyword definitions generated.' }]).map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
                  <CheckCircle size={16} color="var(--success)" />
                  <span><strong>{item.keyword}:</strong> {item.meaning}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={styles.adviceBox}>
            <h4 style={{ marginBottom: '8px' }}>Best Next Advice:</h4>
            <p style={styles.adviceText}>{result.advice}</p>
          </div>

          <button className="btn btn-primary" onClick={resetAll} style={{ marginTop: '24px' }}>
            Analyze Another Document
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 'none',
    margin: '0 auto',
  },
  uploadArea: {
    border: '2px dashed var(--primary)',
    backgroundColor: 'var(--surface)',
    borderRadius: 'var(--radius-lg)',
    padding: '56px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  languageSelector: {
    marginTop: '16px',
    display: 'flex',
    gap: '12px',
    width: '100%',
    maxWidth: '360px',
    justifyContent: 'center',
  },
  languageBox: {
    flex: 1,
    minWidth: '120px',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    backgroundColor: 'var(--surface)',
    color: 'var(--text-dark)',
    padding: '10px 14px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  languageBoxActive: {
    border: '2px solid var(--primary)',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary-dark)',
  },
  previewImage: {
    marginTop: '16px',
    width: '100%',
    maxWidth: '360px',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    objectFit: 'cover',
  },
  errorText: {
    marginTop: '12px',
    color: 'var(--danger)',
    fontSize: '0.95rem',
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: 'var(--surface)',
    borderRadius: 'var(--radius-lg)',
    padding: '28px',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid var(--border-color)',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px',
    paddingBottom: '18px',
    borderBottom: '1px solid var(--border-color)',
  },
  summaryBox: {
    backgroundColor: '#eef8ff',
    padding: '16px',
    borderRadius: 'var(--radius-md)',
    marginBottom: '18px',
    borderLeft: '4px solid #2b8bd6',
  },
  summaryText: {
    fontSize: '0.98rem',
    lineHeight: '1.55',
    whiteSpace: 'pre-wrap',
  },
  highlightsBox: {
    padding: '16px',
    backgroundColor: 'var(--bg-color)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    marginBottom: '18px',
  },
  adviceBox: {
    padding: '16px',
    backgroundColor: '#f6fff3',
    borderRadius: 'var(--radius-md)',
    borderLeft: '4px solid #2f9d50',
    marginBottom: '18px',
  },
  adviceText: {
    fontSize: '0.96rem',
    lineHeight: '1.55',
    whiteSpace: 'pre-wrap',
  },
};

export default Scanner;
