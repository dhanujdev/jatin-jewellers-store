import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What are Lab Grown Diamonds?",
    answer: "Lab Grown Diamonds are diamonds that are created in a laboratory setting rather than being mined from the Earth. These diamonds possess the same physical, chemical, and optical properties as natural diamonds. They are real diamonds in every sense, just with a different origin story."
  },
  {
    question: "Are Lab Grown Diamonds real diamonds?",
    answer: "Yes, Lab Grown Diamonds are real diamonds. Despite being grown in reactors in labs, these diamonds possess the same physical and optical characteristics as natural diamonds. Any diamond is a diamond not because it is mined from the earth but because of its chemical composition."
  },
  {
    question: "How do Lab Grown Diamonds compare to natural diamonds?",
    answer: "Lab Grown Diamonds are identical to natural diamonds in terms of their physical, chemical, and optical properties. Even expert gemologists cannot tell the difference without specialized equipment. They have the same hardness, brilliance, and fire as natural diamonds."
  },
  {
    question: "Are Lab Grown Diamonds graded and certified?",
    answer: "Yes, Lab Grown Diamonds are graded using the same criteria as natural diamonds (cut, color, clarity, and carat weight). Our diamonds come with certificates from internationally recognized grading laboratories like IGI and GIA."
  },
  {
    question: "What is your return and exchange policy?",
    answer: "We offer a 15-day return policy for all our products. If you're not completely satisfied with your purchase, you can return it for a full refund. We also offer a lifetime exchange policy where you can exchange your jewelry for another piece of equal or higher value."
  },
  {
    question: "Do you offer customization options?",
    answer: "Yes, we offer customization services for our jewelry. You can work with our design team to create a unique piece that matches your vision. Contact us at support@jatinjewellers.in to discuss your requirements."
  },
];

export default function FaqSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-playfair text-center mb-4 text-gray-800">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Everything you need to know about lab-grown diamonds and our jewelry
        </p>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium text-gray-800 hover:text-gold-dark">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/faqs"
            className="text-gold-dark hover:text-gold inline-flex items-center font-medium"
          >
            View all FAQs
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
