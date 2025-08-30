import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Globe } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About: React.FC = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission", 
      description: "To revolutionize Kenya's construction industry by creating seamless connections between builders and suppliers, fostering growth and innovation."
    },
    {
      icon: Users,
      title: "Community First",
      description: "We believe in building strong relationships and supporting local businesses to create a thriving construction ecosystem."
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Every supplier and builder on our platform is verified to ensure the highest standards of quality and reliability."
    },
    {
      icon: Globe,
      title: "National Reach",
      description: "Connecting construction professionals across all 47 counties of Kenya, from Nairobi to remote rural areas."
    }
  ];

  const team = [
    {
      name: "Sila Kapting'ei",
      role: "CEO",
      description: "15 years experience in construction and technology",
      image: "/placeholder.svg"
    },
    {
      name: "Hillary Kaptng'ei ",
      role: "CTO & Founder",
      description: "senior engineer at leading tech companies",
      image: "/placeholder.svg"
    },
    {
      name: "Eliud Rugut",
      role: "Head of Operations",
      description: "Expert in supply chain and logistics management",
      image: "/placeholder.svg"
    },
    {
      name: "Mary Akinyi",
      role: "Head of Business Development",
      description: "Specialist in B2B relationships and partnerships",
      image: "/placeholder.svg"
    }
  ];

  return (
    <>
      <title>About UjenziPro - Kenya's Leading Construction Platform</title>
      <meta name="description" content="Learn about UjenziPro's mission to transform Kenya's construction industry by connecting builders with trusted suppliers across all 47 counties." />
      <meta name="keywords" content="UjenziPro, Kenya construction, building materials, suppliers, contractors, construction platform" />
      <meta property="og:title" content="About UjenziPro - Kenya's Leading Construction Platform" />
      <meta property="og:description" content="Discover how UjenziPro is revolutionizing Kenya's construction industry through technology and innovation." />
      <meta property="og:type" content="website" />
      <link rel="canonical" href="/about" />
      
      <div className="min-h-screen bg-gradient-construction">
        <Navigation />

        {/* Hero Section */}
        <section 
          className="text-white py-20 relative bg-hero-pattern"
          role="banner"
          aria-labelledby="hero-heading"
        >
          <div 
            className="absolute inset-0 bg-black/70"
            style={{
              backgroundImage: `url('/lovable-uploads/6ea15a8f-a981-4c02-a56e-64ed62ab7a57.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
            role="img"
            aria-label="Construction site showing building materials and workers"
          />
          <div className="container mx-auto px-4 text-center relative z-10">
            <Badge className="mb-4 bg-white/20 text-white border-white/30" aria-label="Proudly Kenyan company">
              🇰🇪 Proudly Kenyan
            </Badge>
            <h1 id="hero-heading" className="text-5xl font-bold mb-6 text-construction-orange drop-shadow-lg">About UjenziPro</h1>
            <p className="text-xl max-w-3xl mx-auto text-safety-yellow font-medium drop-shadow-md">
              We're on a mission to transform Kenya's construction industry by connecting builders
              with trusted suppliers, making construction projects more efficient, affordable, and successful.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 bg-muted" role="main" aria-labelledby="story-heading">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 id="story-heading" className="text-4xl font-bold text-center mb-12">Our Story</h2>
              <div className="prose prose-lg mx-auto">
                <p className="text-lg leading-relaxed mb-6 text-muted-foreground">
                  UjenziPro was born from a simple observation: Kenya's construction industry needed
                  not just better connections, but complete project visibility. As builders struggled to find 
                  reliable suppliers and track their material deliveries, while suppliers couldn't efficiently 
                  reach their ideal customers, we saw an opportunity to revolutionize the entire construction workflow.
                </p>
                <p className="text-lg leading-relaxed mb-6 text-muted-foreground">
                  Founded in 2023 by a team of construction industry veterans and technology experts, 
                  we've quickly grown to become Kenya's leading platform for construction professionals. 
                  Our comprehensive solution goes beyond simple connections - we provide real-time project tracking, 
                  delivery management, and complete transparency throughout the construction supply chain.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Today, we're proud to serve thousands of builders and suppliers across all 47 counties, 
                  facilitating millions of shillings in transactions, tracking thousands of deliveries, 
                  and providing complete project visibility that's helping build the Kenya of tomorrow.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-secondary" aria-labelledby="values-heading">
          <div className="container mx-auto px-4">
            <h2 id="values-heading" className="text-4xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {values.map((value, index) => (
                <Card 
                  key={`value-${index}`} 
                  className="text-center hover:shadow-lg transition-shadow duration-300 focus-within:ring-2 focus-within:ring-primary"
                  tabIndex={0}
                >
                  <CardHeader>
                    <div className="mx-auto mb-4 p-4 bg-construction-orange/20 rounded-full w-fit">
                      <value.icon className="h-8 w-8 text-construction-orange" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{value.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-accent" aria-labelledby="team-heading">
          <div className="container mx-auto px-4">
            <h2 id="team-heading" className="text-4xl font-bold text-center mb-12">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {team.map((member, index) => (
                <Card 
                  key={`team-member-${index}`} 
                  className="text-center hover:shadow-lg transition-shadow duration-300 focus-within:ring-2 focus-within:ring-primary"
                  tabIndex={0}
                >
                  <CardHeader>
                    <div 
                      className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center"
                      role="img"
                      aria-label={`Photo placeholder for ${member.name}`}
                    >
                      <Users className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription className="text-primary font-medium">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section 
          className="py-20 text-white relative bg-stats-pattern"
          aria-labelledby="stats-heading"
        >
          <div 
            className="absolute inset-0 bg-black/70"
            style={{
              backgroundImage: `url('/lovable-uploads/6ea15a8f-a981-4c02-a56e-64ed62ab7a57.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
            role="img"
            aria-label="Construction site background for statistics"
          />
          <div className="container mx-auto px-4 relative z-10">
            <h2 id="stats-heading" className="text-4xl font-bold text-center mb-12">Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="focus-within:ring-2 focus-within:ring-black rounded-lg p-4" tabIndex={0}>
                <div className="text-4xl font-bold mb-2" aria-label="One thousand plus">1,000+</div>
                <div className="text-lg opacity-90">Active Builders</div>
              </div>
              <div className="focus-within:ring-2 focus-within:ring-black rounded-lg p-4" tabIndex={0}>
                <div className="text-4xl font-bold mb-2" aria-label="Five hundred plus">500+</div>
                <div className="text-lg opacity-90">Verified Suppliers</div>
              </div>
              <div className="focus-within:ring-2 focus-within:ring-black rounded-lg p-4" tabIndex={0}>
                <div className="text-4xl font-bold mb-2" aria-label="Ten thousand plus">10,000+</div>
                <div className="text-lg opacity-90">Successful Connections</div>
              </div>
              <div className="focus-within:ring-2 focus-within:ring-black rounded-lg p-4" tabIndex={0}>
                <div className="text-4xl font-bold mb-2" aria-label="Two billion Kenyan Shillings plus">KSh 2B+</div>
                <div className="text-lg opacity-90">Total Transactions</div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default About;
