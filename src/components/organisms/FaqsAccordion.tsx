import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { useState } from "react";

const faqs = [
	{
		question: "What's the best thing about Switzerland?",
		answer: "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
	},
	{
		question: "What's the best thing about Switzerland?",
		answer: "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
	},
	{
		question: "What's the best thing about Switzerland?",
		answer: "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
	},
	{
		question: "What's the best thing about Switzerland?",
		answer: "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
	},
];

function FaqsAccordion() {
	const [activeFaq, setActiveFaq] = useState(0);
	return (
		<LazyMotion features={domAnimation}>
			<div className="container py-20">
				<dl className="mt-10 space-y-6 divide-y divide-white/10">
					{faqs.map((faq, index) => (
						<Faq {...faq} key={`faq-${index}`} activeFaq={activeFaq} setActiveFaq={setActiveFaq} index={index} />
					))}
				</dl>
			</div>
		</LazyMotion>
	);
}

export default FaqsAccordion;

function Faq({ question, answer, index, activeFaq, setActiveFaq }) {
	const isActiveFaq = activeFaq === index;

	const handleToggle = () => {
		setActiveFaq(isActiveFaq ? null : index);
	};

	return (
		<div>
			<dt className="text-lg">
				<button type="button" aria-label="Expand/collapse question button" aria-controls={`faq-${index}`} aria-expanded={isActiveFaq} onClick={handleToggle}>
					{question}
				</button>
			</dt>
			<AnimatePresence>
				{isActiveFaq && (
					<m.dd
						layout="position"
						id={`faq-${index}`}
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
						className="overflow-hidden"
					>
						<div className="pt-2" dangerouslySetInnerHTML={{ __html: answer }} />
					</m.dd>
				)}
			</AnimatePresence>
		</div>
	);
}
