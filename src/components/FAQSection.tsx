
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "How does the AI generate my resume?",
      answer: "Our AI analyzes your input information, industry standards, and successful resume patterns to create compelling, tailored content that highlights your strengths and achievements."
    },
    {
      question: "Can I edit the resume after uploading?",
      answer: "Absolutely! You can edit any part of your resume using our intuitive editor. Add, remove, or modify sections, change formatting, and update content in real-time."
    },
    {
      question: "What's included in the Premium Plan?",
      answer: "Premium includes 50 resumes per day, access to premium templates, priority customer support, advanced customization options, and detailed analytics dashboard."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security seriously. All your information is encrypted and stored securely. We never share your personal data with third parties without your explicit consent."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Of course! You can cancel your Premium subscription at any time. You'll continue to have access to premium features until the end of your billing period."
    }
  ];

  return (
    <section id="faqs" className="section-shell bg-gradient-to-b from-blue-50 to-white">
      <div className="section-container">
        <div className="section-heading">
          <h2 className="section-title mb-4">
            Frequently Asked Questions
          </h2>
          <p className="section-subtitle max-w-2xl">
            Get answers to the most common questions about ResumeVar
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="card-soft overflow-hidden"
              >
                <AccordionTrigger className="px-6 sm:px-8 py-5 text-left text-base sm:text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 sm:px-8 pb-6 text-gray-600 text-sm sm:text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
