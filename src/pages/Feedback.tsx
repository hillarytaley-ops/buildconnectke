import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { FeedbackForm } from "@/components/FeedbackForm";

export default function Feedback() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main 
        className="container mx-auto px-4 py-16 bg-muted/20 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/lovable-uploads/7cfcf7b9-f15f-4327-809e-aa6ddc908424.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              We Value Your Feedback
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Help us improve by sharing your thoughts, suggestions, or reporting any issues you've encountered.
            </p>
          </div>
          
          <div className="mb-8">
            <div className="bg-background/90 backdrop-blur-sm p-6 rounded-lg border max-w-2xl mx-auto">
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 text-primary mt-0.5">🔒</div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Privacy & Data Protection</h3>
                  <p className="text-sm text-muted-foreground">
                    Your feedback is confidential and secure. We use industry-standard encryption 
                    to protect your data and never share personal information with third parties. 
                    Feedback is used solely for service improvement purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <FeedbackForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}