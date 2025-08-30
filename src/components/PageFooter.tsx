import { Mail, Heart, MessageCircle } from "lucide-react";

const PageFooter = () => {
	return (
		<footer className="bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 text-white py-6 px-4 mt-10">
			<div className="max-w-4xl mx-auto flex flex-col items-center justify-between gap-4 text-center text-sm sm:flex-row sm:text-left">
				{/* Left - Contact */}
				<div className="flex flex-col sm:flex-row items-center gap-4 text-blue-200">
					<div className="flex items-center gap-2">
						<Mail className="h-4 w-4" />
						<a
							href="mailto:support@resumevar.com"
							className="hover:underline"
						>
							support@resumevar.com
						</a>
					</div>
					<div className="flex items-center gap-2">
						<MessageCircle className="h-4 w-4" />
						<a
							href="https://wa.me/919573140921"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:underline"
						>
							+91 9573140921
						</a>
					</div>
				</div>

				{/* Right - Copyright */}
				<div className="flex items-center gap-1 text-blue-200">
					<span>© {new Date().getFullYear()} ResumeVar.</span>
					<span>Made with</span>
					<Heart className="h-4 w-4 text-pink-400" />
					<span>for professionals.</span>
				</div>
			</div>
		</footer>
	);
};

export default PageFooter;
