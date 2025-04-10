import React, { useState } from 'react';

// Assuming these components are correctly set up in the project structure
// using shadcn/ui or a similar library, and a path alias '@' is configured
// to point to the 'src' or equivalent directory.
import { Button } from "@/components/ui/button"; // Changed path
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Changed path
import { Input } from "@/components/ui/input"; // Changed path
import { Label } from "@/components/ui/label"; // Changed path
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Changed path
import { Checkbox } from "@/components/ui/checkbox"; // Changed path
import { Separator } from "@/components/ui/separator"; // Changed path
import { Progress } from "@/components/ui/progress"; // Changed path

// Define the structure for feature importance
interface FeatureImportance {
  feature: string;
  importance: number; // Represents percentage importance (0-100)
}

export default function CardioGuardMoE() {
  // State for patient data input
  const [patientData, setPatientData] = useState({
    age: '',
    sex: '',
    ethnicity: [] as string[], // Explicitly type arrays
    medicalHistory: [] as string[],
    currentMedication: [] as string[],
    ehrRecord: null as File | null, // Type for file upload
  });

  // State for results
  const [maceRisk, setMaceRisk] = useState<number | null>(null);
  const [medicationRecommendations, setMedicationRecommendations] = useState<string[] | null>(null);
  const [surgeryRecommendations, setSurgeryRecommendations] = useState<string[] | null>(null);
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); // State for loading indicator

  // --- Input Handlers ---

  // Handles changes in simple input fields (age)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Basic validation for age (allow only numbers)
    if (name === 'age' && value !== '' && !/^\d+$/.test(value)) {
        return; // Prevent non-numeric input for age
    }
    setPatientData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handles changes in the Select component (sex)
  const handleSelectChange = (name: string, value: string) => {
     setPatientData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handles changes in Checkbox groups (ethnicity, medical history, medication)
  const handleMultiSelectChange = (name: keyof typeof patientData, option: string, checked: boolean | string) => {
    // Ensure 'checked' is boolean
    const isChecked = typeof checked === 'boolean' ? checked : checked === 'true';

    setPatientData((prevData) => {
      // Type assertion needed as patientData properties can be string | string[] | File | null
      const currentValues = (prevData[name] as string[]) || [];

      if (isChecked) {
        // Add option if not already present
        return { ...prevData, [name]: [...currentValues, option] };
      } else {
        // Remove option
        return { ...prevData, [name]: currentValues.filter((item) => item !== option) };
      }
    });
  };

  // Handles file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPatientData((prevData) => ({ ...prevData, ehrRecord: e.target.files[0] }));
    } else {
       setPatientData((prevData) => ({ ...prevData, ehrRecord: null }));
    }
  };

  // --- Data Processing Simulation ---

  const processPatientData = () => {
    setIsProcessing(true); // Start loading state
    setMaceRisk(null); // Clear previous results
    setMedicationRecommendations(null);
    setSurgeryRecommendations(null);
    setFeatureImportance(null);

    // Simulate API call or complex computation
    setTimeout(() => {
      // --- Simulate MACE Risk Calculation ---
      // Add some basic input validation feedback if needed (e.g., age is required)
      if (!patientData.age || !patientData.sex) {
          console.error("Age and Sex are required fields.");
          // Optionally, set an error state to display a message to the user
          setIsProcessing(false);
          return; // Stop processing if required fields are missing
      }
      const simulatedMaceRisk = Math.random() * 30 + 5; // Simulate risk between 5% and 35%

      // --- Simulate Feature Importance ---
      // Assign random importance scores to selected features
      // Use a base importance map for clarity
      const baseImportance: { [key: string]: number } = {
          Age: 0.3,
          Sex: 0.15,
          Ethnicity: 0.05,
          Smoking: 0.2,
          'Previous Cardiac Event': 0.35,
          Diabetes: 0.25,
          Cancer: 0.05,
          Hypertension: 0.15,
          Dyslipidemia: 0.1,
          Aspirin: 0.05,
          'Beta Blockers': 0.05,
          'ACE Inhibitors': 0.05,
          Statins: 0.1,
          Anticoagulants: 0.08,
          Diuretics: 0.03,
          'EHR Data': 0.25,
      };

      const importanceData: FeatureImportance[] = [];
      // Add importance based on input values, slightly randomized
      if (patientData.age) importanceData.push({ feature: 'Age', importance: baseImportance.Age * (1 + Math.random() * 0.2 - 0.1) });
      if (patientData.sex) importanceData.push({ feature: 'Sex', importance: baseImportance.Sex * (1 + Math.random() * 0.2 - 0.1) });
      patientData.ethnicity.forEach(e => importanceData.push({ feature: `Ethnicity: ${e}`, importance: baseImportance.Ethnicity * (1 + Math.random() * 0.4 - 0.2) }));
      patientData.medicalHistory.forEach(h => {
          if (baseImportance[h]) {
              importanceData.push({ feature: `History: ${h}`, importance: baseImportance[h] * (1 + Math.random() * 0.3 - 0.15) });
          }
      });
      patientData.currentMedication.forEach(m => {
           if (baseImportance[m]) {
              importanceData.push({ feature: `Medication: ${m}`, importance: baseImportance[m] * (1 + Math.random() * 0.3 - 0.15) });
           }
      });
      if (patientData.ehrRecord) importanceData.push({ feature: 'EHR Data', importance: baseImportance['EHR Data'] * (1 + Math.random() * 0.2 - 0.1) });

      // Normalize importance scores to sum to 100%
      const totalImportance = importanceData.reduce((sum, item) => sum + item.importance, 0);
      const normalizedImportance = importanceData
        .map(item => ({ ...item, importance: totalImportance > 0 ? Math.max(0.1, (item.importance / totalImportance) * 100) : 0 })) // Ensure minimum 0.1% to show on progress bar
        .sort((a, b) => b.importance - a.importance); // Sort by importance descending

      // --- Simulate Treatment Recommendations ---
      const recommendedMeds: string[] = [];
      const recommendedSurgeries: string[] = [];

      // Example logic based on risk and history (replace with actual AI logic)
      if (simulatedMaceRisk > 20 || patientData.medicalHistory.includes('Previous Cardiac Event')) {
        recommendedMeds.push('High-Intensity Statins', 'Dual Antiplatelet Therapy (DAPT)');
        if (patientData.medicalHistory.includes('Hypertension')) recommendedMeds.push('ACE Inhibitor or ARB');
        if (patientData.medicalHistory.includes('Diabetes')) recommendedMeds.push('SGLT2 inhibitor or GLP-1 RA');
        recommendedSurgeries.push('Coronary Angiography +/- PCI', 'CABG Evaluation');
      } else if (simulatedMaceRisk > 10) {
         recommendedMeds.push('Moderate-Intensity Statins', 'Aspirin (81mg)');
         if (patientData.medicalHistory.includes('Hypertension')) recommendedMeds.push('Consider ACE Inhibitor or ARB');
         if (patientData.medicalHistory.includes('Diabetes')) recommendedMeds.push('Consider Metformin, SGLT2i or GLP-1 RA');
         recommendedSurgeries.push('Consider Coronary Calcium Score', 'Consider Stress Test');
      } else {
         recommendedMeds.push('Lifestyle Modifications (Diet, Exercise)', 'Consider Low-Dose Aspirin (if high ASCVD risk)');
         if (patientData.medicalHistory.includes('Hypertension')) recommendedMeds.push('Continue existing BP meds / Lifestyle');
         recommendedSurgeries.push('Routine Follow-up', 'Preventive Screening');
      }
      if(patientData.medicalHistory.includes('Smoking')) {
        recommendedMeds.push('Smoking Cessation Counseling/Therapy');
      }

      // --- Update State with Simulated Results ---
      setMaceRisk(simulatedMaceRisk);
      setFeatureImportance(normalizedImportance);
      setMedicationRecommendations(recommendedMeds);
      setSurgeryRecommendations(recommendedSurgeries);
      setIsProcessing(false); // End loading state
    }, 1500); // Simulate network delay
  };

  // --- Options for Checkboxes ---
  // Kept consistent with previous version
  const ethnicityOptions = ['Asian', 'Black or African American', 'Hispanic or Latino', 'White', 'Other'];
  const medicalHistoryOptions = ['Smoking', 'Previous Cardiac Event', 'Diabetes', 'Cancer', 'Hypertension', 'Dyslipidemia'];
  const currentMedicationOptions = ['Aspirin', 'Beta Blockers', 'ACE Inhibitors', 'Statins', 'Anticoagulants', 'Diuretics'];

  return (
    // Main card container
    <Card className="w-full max-w-4xl mx-auto my-8 shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
        <CardTitle className="text-2xl font-bold text-center text-white">CardioGuard MoE</CardTitle>
        <CardDescription className="text-center text-blue-100 mt-1">
          AI-Powered MACE Risk Assessment and Treatment Recommendation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Section 1: Static Patient Information */}
        <Card className="border border-gray-200 shadow-sm rounded-md">
          <CardHeader className="bg-gray-50 p-4 border-b">
            <CardTitle className="text-lg font-semibold text-gray-800">Static Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Age Input */}
            <div>
              <Label htmlFor="age" className="font-medium text-sm">Age</Label>
              <Input
                id="age"
                name="age"
                type="number" // Use number type for age
                value={patientData.age}
                onChange={handleInputChange}
                placeholder="e.g., 55"
                className="mt-1"
                min="0" // Basic validation
              />
            </div>
             {/* Sex Selection */}
            <div>
              <Label htmlFor="sex" className="font-medium text-sm">Sex</Label>
              <Select
                name="sex"
                value={patientData.sex}
                onValueChange={(value) => handleSelectChange('sex', value)}
              >
                <SelectTrigger id="sex" className="mt-1">
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Ethnicity Checkboxes */}
            <div className="md:col-span-2">
              <Label className="font-medium mb-2 block text-sm">Ethnicity</Label>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {ethnicityOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`ethnicity-${option}`} // Ensure unique IDs
                      checked={patientData.ethnicity.includes(option)}
                      onCheckedChange={(checked) => {
                        handleMultiSelectChange('ethnicity', option, checked);
                      }}
                    />
                    <Label htmlFor={`ethnicity-${option}`} className="font-normal cursor-pointer text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Temporal Patient Information */}
         <Card className="border border-gray-200 shadow-sm rounded-md">
           <CardHeader className="bg-gray-50 p-4 border-b">
            <CardTitle className="text-lg font-semibold text-gray-800">Temporal Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {/* Medical History Checkboxes */}
            <div>
              <Label className="font-medium mb-2 block text-sm">Medical History (Select all that apply)</Label>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {medicalHistoryOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`history-${option}`}
                      checked={patientData.medicalHistory.includes(option)}
                      onCheckedChange={(checked) => {
                        handleMultiSelectChange('medicalHistory', option, checked);
                      }}
                    />
                    <Label htmlFor={`history-${option}`} className="font-normal cursor-pointer text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            </div>
            {/* Current Medication Checkboxes */}
             <div>
              <Label className="font-medium mb-2 block text-sm">Current Medication (Select all that apply)</Label>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {currentMedicationOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`med-${option}`}
                      checked={patientData.currentMedication.includes(option)}
                      onCheckedChange={(checked) => {
                        handleMultiSelectChange('currentMedication', option, checked);
                      }}
                    />
                    <Label htmlFor={`med-${option}`} className="font-normal cursor-pointer text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            </div>
            {/* EHR File Upload */}
             <div>
              <Label htmlFor="ehr-record" className="font-medium text-sm">Upload EHR Record (Optional)</Label>
              <Input
                id="ehr-record"
                type="file"
                onChange={handleFileUpload}
                className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
               {patientData.ehrRecord && (
                 <p className="text-sm text-gray-500 mt-1">File selected: {patientData.ehrRecord.name}</p>
               )}
            </div>
          </CardContent>
        </Card>

        {/* Process Button */}
        <div className="text-center pt-4">
          <Button
            onClick={processPatientData}
            disabled={isProcessing || !patientData.age || !patientData.sex} // Disable button while processing or if required fields missing
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-lg transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isProcessing ? 'Processing...' : 'Analyze Patient Data'}
          </Button>
           {/* Show message if required fields are missing */}
           {!isProcessing && (!patientData.age || !patientData.sex) && (
               <p className="text-xs text-red-500 mt-2">Please enter Age and Sex to enable analysis.</p>
           )}
        </div>

        {/* Results Section - Shown only after processing */}
        {isProcessing && (
            <div className="text-center py-6">
                <div role="status" className="flex justify-center items-center space-x-2">
                    <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5424 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="text-gray-600">Analyzing data... Please wait.</span>
                </div>
            </div>
        )}

        {/* Display results only when not processing AND maceRisk is calculated */}
        {!isProcessing && maceRisk !== null && (
          <div className="mt-6 space-y-6 animate-fade-in"> {/* Added fade-in animation */}
            <Separator />
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Analysis Results</h2>

            {/* MACE Risk */}
            <Card className="bg-red-50 border-red-200 rounded-lg shadow-sm">
              <CardHeader className="p-4">
                <CardTitle className="text-lg text-red-800">Estimated MACE Risk (1 Year)</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-4xl font-bold text-red-700 text-center">{maceRisk.toFixed(1)}%</p>
                 <p className="text-sm text-gray-600 text-center mt-2">Major Adverse Cardiac Events (e.g., heart attack, stroke, cardiovascular death)</p>
              </CardContent>
            </Card>

            {/* Feature Importance (Explainable AI) */}
            {featureImportance && featureImportance.length > 0 && (
              <Card className="bg-gray-50 border-gray-200 rounded-lg shadow-sm">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg text-gray-800">Key Risk Contributors (Feature Importance)</CardTitle>
                  <CardDescription className="text-sm text-gray-600">Factors influencing the risk score calculation.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {featureImportance.map((item) => (
                    <div key={item.feature}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 flex-1 pr-2">{item.feature}</span>
                        <span className="text-sm font-semibold text-blue-600 w-12 text-right">{item.importance.toFixed(1)}%</span>
                      </div>
                      {/* Use Progress component for visual representation */}
                      <Progress value={item.importance} className="h-2 [&>div]:bg-blue-500" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Treatment Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Medication Recommendations */}
              {medicationRecommendations && medicationRecommendations.length > 0 && (
                <Card className="bg-green-50 border-green-200 rounded-lg shadow-sm">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg text-green-800">Medication Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <ul className="list-disc list-inside space-y-1 text-green-700 text-sm">
                      {medicationRecommendations.map((med, index) => (
                        <li key={`med-${index}`}>{med}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Surgery/Procedure Recommendations */}
              {surgeryRecommendations && surgeryRecommendations.length > 0 && (
                <Card className="bg-yellow-50 border-yellow-200 rounded-lg shadow-sm">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg text-yellow-800">Procedure/Surgery Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <ul className="list-disc list-inside space-y-1 text-yellow-700 text-sm">
                      {surgeryRecommendations.map((proc, index) => (
                        <li key={`proc-${index}`}>{proc}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
             {/* Disclaimer Footer */}
             <CardFooter className="text-xs text-gray-500 text-center pt-6">
                 <strong>Disclaimer:</strong> This tool provides simulated recommendations based on input data. It is not a substitute for professional medical advice. Always consult with a qualified healthcare professional for diagnosis and treatment decisions.
            </CardFooter>
          </div>
        )}
      </CardContent>
       {/* Basic CSS for fade-in animation (can be added to a global CSS file or style tag) */}
       <style jsx global>{`
         @keyframes fadeIn {
           from { opacity: 0; transform: translateY(10px); }
           to { opacity: 1; transform: translateY(0); }
         }
         .animate-fade-in {
           animation: fadeIn 0.5s ease-out forwards;
         }
       `}</style>
    </Card>
  );
}
