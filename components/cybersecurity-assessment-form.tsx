"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import {
  ChevronLeft,
  Check,
  Mail,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import ReactConfetti from "react-confetti";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
// import ReactSpeedometer, {
// } from "react-d3-speedometer";
// import styles from "@/styles/CybersecurityAssessmentForm.module.css";
import { translations } from '@/lib/translations';
import { questionsData, Question } from '@/lib/questions';

// Add this custom hook
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function updateSize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;
}

type Language = 'en';

// Add this near the top of the file, before the component
// const BLOCKED_EMAIL_DOMAINS = [
//   "gmail.com",
//   "yahoo.com",
//   "hotmail.com",
//   "outlook.com",
//   "aol.com",
//   "icloud.com",
//   "mail.com",
// ];

export const getResultText = (score: number, language: Language = 'en') => {
  const t = translations[language].resultTexts;
  if (score >= 85) return t.advanced;
  if (score >= 65) return t.solid;
  if (score >= 35) return t.basic;
  return t.urgent;
};

export function CybersecurityAssessmentForm() {
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    date: "",
    role: "",
    environmentType: "",
    environmentSize: "",
    environmentImportance: "",
    environmentMaturity: "",
    environmentUniqueName: "",
    marketSector: "",
    country: "",
    email: "",
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [currentLanguage] = useState<Language>('en');
  const [questions] = useState<Question[]>(questionsData[currentLanguage]);
  const isRTL = false;

  const t = translations[currentLanguage];

  const formSchema = z.object({
    name: z.string().min(2, { message: "Please enter your name." }),
    date: z.string().min(2, { message: "Please enter the date." }),
    role: z.string().min(2, { message: "Please select your role or job title." }),
    environmentType: z.string().min(2, { message: "Please specify the type of environment." }),
    environmentSize: z.string().min(1, { message: "Please specify the size of the environment." }),
    environmentImportance: z.string().min(2, { message: "Please specify the importance of the environment." }),
    environmentMaturity: z.string().min(2, { message: "Please specify the maturity of the environment." }),
    environmentUniqueName: z.string().min(2, { message: "Please enter a unique name for this environment." }),
    marketSector: z.string().min(2, { message: "Please specify the market sector." }),
    country: z.string().min(2, { message: "Please select your country." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      date: "",
      role: "",
      environmentType: "",
      environmentSize: "",
      environmentImportance: "",
      environmentMaturity: "",
      environmentUniqueName: "",
      marketSector: "",
      country: "",
      email: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit"
  });

  const handlePersonalInfoSubmit = (values: z.infer<typeof formSchema>) => {
    setPersonalInfo(values);
    setCurrentQuestion(1); // Move to the first question
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: value }));
    
    // Automatically move to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < questions.length) {
        setFormErrors([]);
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // If this is the last question, calculate score
        calculateScore();
      }
    }, 300); // 300ms delay for better UX
  };

  // const handleNext = () => {
  //   if (currentQuestion === 0) {
  //     form.handleSubmit(handlePersonalInfoSubmit)();
  //   } else if (currentQuestion < questions.length) {
  //     // Since we're auto-advancing, we don't need to check for answers here
  //     // The validation is handled in handleAnswerChange
  //     setFormErrors([]);
  //     setCurrentQuestion(currentQuestion + 1);
  //   } else {
  //     calculateScore();
  //   }
  // };

  const calculateScore = async () => {
    const totalScore = Object.values(answers).reduce(
      (sum, value) => sum + parseInt(value),
      0
    );
    setScore(totalScore);

    // Animate the score
    const animationDuration = 1000; // 1 second
    const frameDuration = 1000 / 60; // 60 fps
    const totalFrames = Math.round(animationDuration / frameDuration);
    let frame = 0;
    const animate = () => {
     
      // setAnimatedScore(Math.floor(progress * totalScore)); // This line is removed
      if (frame < totalFrames) {
        frame++;
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5 seconds

    // Prepare the data to be sent via API
    const assessmentData = {
      personalInfo,
      answers,
      score: totalScore,
    };

    // Send the data to the server
    try {
      console.log("Sending assessment data:", assessmentData);
      
      // Send internal notification
      const response = await fetch("/api/send-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assessmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Internal email error:", errorData);
        throw new Error(
          errorData.message || "Failed to send assessment results"
        );
      }

      console.log("Internal email sent successfully");

      // Send user email notification
      const userEmailResponse = await fetch("/api/send-user-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assessmentData),
      });

      if (!userEmailResponse.ok) {
        const errorData = await userEmailResponse.json();
        console.error("User email error:", errorData);
        throw new Error(errorData.message || "Failed to send user email");
      }

      console.log("User email sent successfully to:", personalInfo.email);
    } catch (error) {
      console.error("Error sending assessment results:", error);
      // Show error to user
      alert("There was an issue sending the assessment results. Please try again or contact support.");
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // const getScoreColor = (score: number) => {
  //   if (score >= 85) return "text-green-500";
  //   if (score >= 65) return "text-yellow-500";
  //   if (score >= 35) return "text-orange-500";
  //   return "text-red-500";
  // };



  return (
    <div className={`min-h-screen w-full py-4 sm:py-8 md:py-12 px-2 sm:px-4 md:px-6 lg:px-8 flex items-center justify-center ${isRTL ? 'rtl' : 'ltr'}`}>
      {showConfetti && <ReactConfetti width={width} height={height} />}
      <div className="w-full max-w-4xl -mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden mb-4 sm:mb-8"
        >
          <div className="rounded-t-lg">
            <Image
              src="https://cdn-nexlink.s3.us-east-2.amazonaws.com/Frame_46_(3)_e95f9944-bc4a-4dae-aefb-02c89335e8c3.png"
              alt="Cyber Self Assessment Tool Banner"
              width={1200}
              height={300}
              className="w-full h-auto"
            />

          </div>

          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4 sm:p-6 md:p-8">
            <AnimatePresence mode="wait">
              {currentQuestion === 0 ? (
                <motion.div
                  key="personal-info"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="m-2 sm:m-4 md:m-8 border-none shadow-none bg-white/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-xl sm:text-2xl text-white">
                        Organisational and Environmental Information
                      </CardTitle>
                      <CardDescription className="text-white">
                        Please provide the following details:
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(handlePersonalInfoSubmit)}
                          className="space-y-6"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="flex gap-4">
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem className="w-7/10">
                                    <FormLabel className="text-white font-semibold">
                                      Please enter your name:
                                    </FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                  <FormItem className="w-3/10">
                                    <FormLabel className="text-white font-semibold">
                                      Date:
                                    </FormLabel>
                                    <FormControl>
                                      <Input {...field} type="date" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={form.control}
                              name="role"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white font-semibold">
                                    Please select your role or job title:
                                  </FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="environmentType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white font-semibold">
                                    What type of environment are you assessing?
                                  </FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="environmentSize"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white font-semibold">
                                    What is the size of the environment covered by this questionnaire?
                                  </FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="environmentImportance"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white font-semibold">
                                    What is the overall importance of the environment to the organisation?
                                  </FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="environmentMaturity"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white font-semibold">
                                    What is the overall maturity of the environment in relation to information security?
                                  </FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="environmentUniqueName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white font-semibold">
                                    Please enter a unique name for this environment:
                                  </FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="marketSector"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white font-semibold">
                                    What market sector best applies to this environment?
                                  </FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="country"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white font-semibold">
                                    Please select your country:
                                  </FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white font-semibold">
                                    Please enter your email address:
                                  </FormLabel>
                                  <FormControl>
                                    <Input {...field} type="email" placeholder="your.email@company.com" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#3B3FA1] via-[#1B56B7] to-[#0072CD] hover:from-[#2A2D8A] hover:via-[#1A4BA3] hover:to-[#005BB3] text-white shadow-lg transform transition-all duration-300 hover:scale-105"
                          >
                            Start Assessment
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : score === null ? (
                <motion.div
                  key={`question-${currentQuestion}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="m-2 sm:m-4 md:m-8 border-none shadow-none bg-white/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-xl sm:text-2xl text-white">
                        Question {currentQuestion} of {questions.length}
                      </CardTitle>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-200">
                          <span className="font-semibold">Category:</span> {questions[currentQuestion - 1].category}
                        </div>
                        <div className="text-sm text-gray-200">
                          <span className="font-semibold">Area:</span> {questions[currentQuestion - 1].area}
                        </div>
                        <div className="text-sm text-gray-200">
                          <span className="font-semibold">Topic:</span> {questions[currentQuestion - 1].topic}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 sm:space-y-6">
                        <p className="text-base sm:text-lg font-medium text-white">
                          {questions[currentQuestion - 1].text}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                          {questions[currentQuestion - 1].options.map(
                            (option) => {
                              const id = `${questions[currentQuestion - 1].id}-${option.value}`;
                              return (
                                <div
                                  key={option.value}
                                  className="flex items-center"
                                >
                                  <input
                                    type="radio"
                                    id={id}
                                    name={questions[currentQuestion - 1].id}
                                    value={option.value}
                                    checked={
                                      answers[
                                        questions[currentQuestion - 1].id
                                      ] === option.value
                                    }
                                    onChange={() =>
                                      handleAnswerChange(
                                        questions[currentQuestion - 1].id,
                                        option.value,
                                      )
                                    }
                                    className="sr-only peer"
                                    required
                                  />
                                  <Label
                                    htmlFor={id}
                                    className={cn(
                                      "flex flex-1 items-center rounded-lg border border-gray-200 bg-white p-3 text-xs font-medium shadow-sm hover:bg-gray-50 focus:outline-none cursor-pointer h-full",
                                      answers[
                                        questions[currentQuestion - 1].id
                                      ] === option.value &&
                                        "border-green-500 ring-1 ring-green-500",
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        "flex-shrink-0 w-4 h-4 border-2 border-gray-300 rounded-full mr-2 flex items-center justify-center",
                                        answers[
                                          questions[currentQuestion - 1].id
                                        ] === option.value &&
                                          "border-green-500 bg-green-500",
                                      )}
                                    >
                                      <Check
                                        className={cn(
                                          "w-2 h-2 text-white",
                                          answers[
                                            questions[currentQuestion - 1].id
                                          ] === option.value
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                    </div>
                                    <span className="flex-grow text-center">
                                      {option.label}
                                    </span>
                                  </Label>
                                </div>
                              );
                            },
                          )}
                        </div>
                        {formErrors.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-2"
                          >
                            {formErrors.map((error, index) => (
                              <p key={index}>{error}</p>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        onClick={handleBack}
                        disabled={currentQuestion === 1}
                        className="bg-gray-600 text-white hover:bg-gray-500"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        {t.back}
                      </Button>
                      <div className="text-sm text-gray-200 italic">
                        Select an option to continue automatically
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="m-2 sm:m-4 md:m-8 border-none shadow-none bg-transparent backdrop-blur-sm">
                    <CardContent className="p-6">
                      {/* Thank You Message */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="text-center space-y-6"
                      >
                          <div className="flex justify-center">
                          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            </div>
                          </div>
                          <div>
                          <h3 className="text-3xl font-bold text-white mb-4">
                              {t.thankYou.title}
                            </h3>
                          <p className="text-white/90 text-lg leading-relaxed mb-4">
                              {t.thankYou.message}
                            </p>
                          <p className="text-white/80 leading-relaxed mb-3">
                              {t.thankYou.followUp}
                            </p>
                          <p className="text-white/80 leading-relaxed">
                              {t.thankYou.contact}
                            </p>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                        className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:items-center mt-8"
                      >
                        <div className="relative inline-block text-left w-full sm:w-56">
                          <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            type="button"
                            className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
                          >
                            <Mail className="w-5 h-5" />
                            <span className="text-sm font-semibold whitespace-nowrap">
                              {t.bookAppointment}
                            </span>
                            <ChevronDown className="w-5 h-5 ml-2" />
                          </button>
                          <AnimatePresence>
                            {isDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="origin-top-right absolute left-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
                              >
                                <div
                                  className="py-1"
                                  role="menu"
                                  aria-orientation="vertical"
                                >
                                  <a
                                    href="https://mail.google.com/mail/?view=cm&fs=1&to=anisha@cs.rsm.ae&su=Appointment Request with Mazars Team"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    role="menuitem"
                                  >
                                    <img
                                      src="https://cdn-nexlink.s3.us-east-2.amazonaws.com/Gmail_Logo_512px_ac6349b9-814f-4807-895b-e282dfd6ebbe.png"
                                      alt="Gmail"
                                      className="w-5 h-5 mr-3"
                                    />
                                    Gmail
                                  </a>
                                  <a
                                    href="https://outlook.office.com/mail/deeplink/compose?to=anisha@cs.rsm.ae&subject=Appointment%20Request%20with%20Mazars%20Team"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    role="menuitem"
                                  >
                                    <img
                                      src="https://cdn-nexlink.s3.us-east-2.amazonaws.com/images_4f6879cb-b208-4c19-ba36-c4c27b6fda65.jpeg"
                                      alt="Outlook"
                                      className="w-5 h-5 mr-3"
                                    />
                                    Outlook
                                  </a>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <Button
                          className="w-full sm:w-56 flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
                          onClick={async () => {
                            try {
                              const response = await fetch("/api/generate-pdf", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  personalInfo,
                                  score: score || 0,
                                  answers,
                                  questions: questionsData[currentLanguage],
                                  language: currentLanguage,
                                }),
                              });

                              if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.message || "Failed to generate PDF");
                              }

                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              const link = document.createElement("a");
                              link.href = url;
                              link.download = `${personalInfo.environmentUniqueName}_Cyber_Self_Assessment_Report.pdf`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            } catch (error: unknown) {
                              console.error("Error generating PDF:", error);
                              if (error instanceof Error) {
                                alert(`${t.errors.pdfGeneration}: ${error.message}`);
                              } else {
                                alert(t.errors.unknown);
                              }
                            }
                          }}
                        >
                          <div className="w-5 h-5 mr-2 flex items-center justify-center">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              ></path>
                            </svg>
                          </div>
                          <span className="whitespace-nowrap font-medium">{t.downloadReport}</span>
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress bar */}
            {score === null && (
              <motion.div
                className="px-2 sm:px-4 md:px-8 pb-4 sm:pb-6 md:pb-8 mt-4 sm:mt-6 md:mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 via-green-400 to-blue-500"
                    style={{ width: `${((currentQuestion + 1) / (questions.length + 1)) * 100}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / (questions.length + 1)) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center px-1">
                    {Array.from({ length: questions.length + 1 }).map(
                      (_, index) => (
                        <motion.div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index <= currentQuestion
                              ? "bg-white"
                              : "bg-gray-500"
                          } ${index === currentQuestion ? "ring-1 ring-white" : ""}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                        />
                      ),
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
