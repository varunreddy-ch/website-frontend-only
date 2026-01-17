import { Heart, MessageCircle } from "lucide-react";

const demoFormUrl = "https://forms.gle/AVA1DtN8ZCwx58Cd8";

const PageFooter = () => {
	return (
		<footer className="bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 text-white py-6 px-4">
			<div className="max-w-4xl mx-auto flex flex-col items-center justify-between gap-4 text-center text-sm sm:flex-row sm:text-left">
				{/* Left - Contact */}
				<div className="flex flex-col sm:flex-row items-center gap-4 text-blue-200">
					<div className="flex items-center gap-2">
						<MessageCircle className="h-4 w-4" />
						<a
							href={demoFormUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:underline"
						>
							Demo Registration Form
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
