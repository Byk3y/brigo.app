import Link from 'next/link';

export default function SciencePage() {
    const frameworks = [
        {
            title: "Dual Coding Theory",
            description: "Proposed by Allan Paivio in 1971, this theory suggests that the brain processes verbal and visual information through separate channels. Brigo's Study Podcasts engage the auditory-verbal channel, allowing students to create dual mental representations of their study material, which significantly enhances recall.",
            citations: ["Paivio, A. (1971). Imagery and Verbal Processes.", "Clark, J. M., & Paivio, A. (1991). Dual coding theory and education."]
        },
        {
            title: "Retrieval Practice",
            description: "The 'Testing Effect' proves that the act of retrieving information from memory strengthens that memory more than simply re-studying it. Brigo's Smart Flashcards and Adaptive Quizzes force active retrieval, creating more durable and accessible neural pathways for exam day.",
            citations: ["Roediger, H. L., & Karpicke, J. D. (2006). The Power of Testing Memory.", "Karpicke, J. D. (2012). Retrieval-Based Learning."]
        },
        {
            title: "Cognitive Load Theory",
            description: "Developed by John Sweller, this theory focuses on the limited capacity of working memory. Brigo's AI Exam Predictor reduces 'extraneous' cognitive load by filtering out low-probability questions and focusing on the most critical concepts, keeping students in the 'zone of proximal development.'",
            citations: ["Sweller, J. (1988). Cognitive Load During Problem Solving.", "Kirschner, P. A. (2002). Cognitive Load Theory: Implications of cognitive load."]
        }
    ];

    return (
        <div className="min-h-screen bg-[#FFFCF4] text-gray-900 font-sans selection:bg-[#FF4D00]/10">
            <div className="max-w-4xl mx-auto px-6 py-20 lg:py-32">
                <Link href="/" className="inline-flex items-center text-[#FF4D00] font-semibold mb-12 hover:gap-2 transition-all">
                    <span className="mr-2">←</span> Back to Brigo
                </Link>

                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-8">
                    The Science of <span className="text-[#FF4D00]">Brigo</span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed mb-16">
                    Brigo isn't just a study app; it's a cognitive performance system. Every feature—from podcasts to predictions—is engineered using validated research in educational psychology and neuroscience.
                </p>

                <div className="space-y-20">
                    {frameworks.map((fw) => (
                        <section key={fw.title} className="border-l-4 border-[#FF4D00] pl-8">
                            <h2 className="text-2xl lg:text-3xl font-bold mb-4">{fw.title}</h2>
                            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                {fw.description}
                            </p>
                            <div className="bg-white/50 rounded-xl p-6 border border-black/5 shadow-sm">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Key Citations</h3>
                                <ul className="space-y-2">
                                    {fw.citations.map((cite) => (
                                        <li key={cite} className="text-sm italic text-gray-500">{cite}</li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    ))}
                </div>

                <footer className="mt-32 pt-12 border-t border-gray-200 text-center">
                    <p className="text-gray-400 text-sm italic">
                        "Optimizing the link between technology and the human brain."
                    </p>
                </footer>
            </div>
        </div>
    );
}
