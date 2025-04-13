import { FAQConfig } from "@/components/landing/FAQ";
import branding from "@/branding.json";

export const faq: FAQConfig = {
  title: "Frequently asked questions",
  faqs:[
  {
    id: "panel1",
    question: "How do I get started with Intervue.ai?",
    answer:
      "Getting started is simple! Create an account, upload your resume, and paste the job description for the position you're targeting. Then, select your preferred interview type (technical, behavioral, or HR) and difficulty level. Our AI will generate a tailored interview experience based on your inputs. You can start practicing immediately and receive comprehensive feedback after each session."
  },
  {
    id: "panel2",
    question: "How realistic are the AI-powered interviews?",
    answer:
      "Our interviews are designed to closely mimic real-world scenarios. The AI adapts questions based on your responses, asks relevant follow-ups, and creates a dynamic conversation flow just like a human interviewer would. We've trained our models on thousands of actual interviews to ensure authenticity in both question content and interviewer interaction style."
  },
  {
    id: "panel3",
    question: "What kind of feedback will I receive after my practice interview?",
    answer:
      "After each session, you'll receive a comprehensive performance analysis that includes an overall score and detailed feedback on multiple dimensions: content quality, communication skills, technical accuracy, and question-specific insights. We highlight your strengths, identify areas for improvement, and provide actionable recommendations to enhance your interview performance."
  },
  {
    id: "panel4",
    question: "Can I customize the interview experience?",
    answer:
      "Absolutely! Intervue.ai offers several customization options. You can select the interview type (technical, behavioral, HR), choose the difficulty level (entry, intermediate, advanced), and even specify industry focus. For technical roles, you can indicate which programming languages or technologies you want to focus on. This flexibility ensures you're practicing exactly what you need for your target position."
  },
  {
    id: "panel5",
    question: "How does Intervue.ai compare to mock interviews with friends or career coaches?",
    answer:
      "While practice with friends or coaches is valuable, Intervue.ai offers unique advantages: 24/7 availability, objective feedback based on data from thousands of successful interviews, consistent quality, and the ability to practice as many times as you need without scheduling constraints. Our AI also eliminates the potential discomfort of receiving critical feedback from someone you know, allowing for more honest self-assessment."
  },
  {
    id: "panel6",
    question: "Is my interview data kept private?",
    answer:
      "We take your privacy seriously. Your resume, job descriptions, and interview responses are encrypted and used solely to provide you with the best practice experience and feedback. We never share your personal information with third parties. You can delete your data at any time from your account settings."
  }]
}
