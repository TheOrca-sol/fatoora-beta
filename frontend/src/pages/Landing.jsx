import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  FileText, 
  Users, 
  BarChart3, 
  Globe, 
  Shield, 
  Download,
  Check, 
  ChevronDown, 
  ChevronRight,
  Star,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Zap,
  Clock,
  CreditCard
} from 'lucide-react';

function Landing() {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');

  const features = [
    {
      icon: FileText,
      title: "Smart Invoice Generation",
      description: "Create professional PDF invoices with automatic numbering, status tracking, and customizable templates.",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Users,
      title: "Client Management",
      description: "Organize your clients with ICE/IF numbers, contact details, and complete invoice history.",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track revenue, monitor payment status, and gain insights with beautiful dashboard analytics.",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: Globe,
      title: "Multilingual & RTL",
      description: "Full support for Arabic, French, and English with right-to-left layout support.",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "Google and Apple sign-in powered by Firebase with enterprise-grade security.",
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      icon: Download,
      title: "Export & Backup",
      description: "Export invoices as CSV or PDF archives. Your data is always accessible and portable.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    }
  ];

  const pricingPlans = [
    {
      name: "Beta Access",
      price: { monthly: "Free", annual: "Free" },
      description: "Join our public beta and help shape the future of Fatoora",
      features: [
        "Full access to all features",
        "Unlimited invoices",
        "Client management",
        "PDF invoice generation",
        "Multi-language support",
        "Export capabilities",
        "Priority beta support",
        "Early access to new features"
      ],
      cta: "Join Beta Now",
      popular: true,
      color: "border-blue-500"
    },
    {
      name: "Future Pro",
      price: { monthly: "TBA", annual: "TBA" },
      description: "Coming soon - Advanced features for growing businesses",
      features: [
        "Everything in Beta",
        "Custom invoice templates",
        "Advanced analytics",
        "Team collaboration",
        "Priority support",
        "Custom logo upload",
        "Advanced integrations",
        "Premium features"
      ],
      cta: "Get Notified",
      popular: false,
      color: "border-gray-200",
      comingSoon: true
    },
    {
      name: "Future Enterprise",
      price: { monthly: "TBA", annual: "TBA" },
      description: "Coming soon - Enterprise-grade invoice management",
      features: [
        "Everything in Pro",
        "Unlimited team members",
        "API access",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
        "White-label options",
        "Enterprise security"
      ],
      cta: "Contact Us",
      popular: false,
      color: "border-gray-200",
      comingSoon: true
    }
  ];

  const testimonials = [
    {
      name: "Sarah El Mansouri",
      role: "Freelance Designer",
      company: "Casablanca",
      avatar: "SE",
      content: "Fatoora transformed how I manage my freelance invoicing. The multilingual support is perfect for my international clients, and the PDF generation is incredibly professional.",
      rating: 5
    },
    {
      name: "Ahmed Benali",
      role: "Small Business Owner",
      company: "Rabat Tech Solutions",
      avatar: "AB",
      content: "Finally, an invoice system that understands Moroccan business needs. The ICE and IF number fields are exactly what we needed. The dashboard analytics help me track my revenue effortlessly.",
      rating: 5
    },
    {
      name: "Fatima Zahra",
      role: "Accounting Manager",
      company: "Atlas Consulting",
      avatar: "FZ",
      content: "The team features and export capabilities make collaboration seamless. We've reduced our invoicing time by 60% since switching to Fatoora.",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "What is the beta program?",
      answer: "Our beta program gives you free access to all Fatoora features while we're still developing the product. You'll help us test features, provide feedback, and shape the future of the platform."
    },
    {
      question: "Is the beta completely free?",
      answer: "Yes! During the beta period, you have unlimited access to all features at no cost. This includes unlimited invoices, client management, PDF generation, and all current functionality."
    },
    {
      question: "Is my data secure during beta?",
      answer: "Absolutely. We use Firebase's enterprise-grade security with encrypted data storage. Your data is protected with the same security standards we'll use in production."
    },
    {
      question: "Do you support Arabic and RTL languages?",
      answer: "Yes! Fatoora fully supports Arabic, French, and English with proper right-to-left (RTL) layout support. Switch languages instantly and serve clients in their preferred language."
    },
    {
      question: "Can I export my invoices and data?",
      answer: "Yes, you can export your invoices as PDF archives or CSV files. This feature is available to all beta users and ensures your data is always accessible."
    },
    {
      question: "What happens when the beta ends?",
      answer: "Beta users will get early access to our paid plans with special pricing. We'll notify you well in advance about any changes, and you'll always be able to export your data."
    }
  ];

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🧾</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Fatoora
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-gray-600 hover:text-blue-600 transition-colors">
                Pricing
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-gray-600 hover:text-blue-600 transition-colors">
                FAQ
              </button>
              <Button variant="outline" onClick={() => window.location.href = '/login'}>
                Sign In
              </Button>
              <Button onClick={() => window.location.href = '/login'}>
                Join Beta
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Zap className="h-4 w-4" />
                  Now in Public Beta
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-tight">
                  Modern Invoice Management Made
                  <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Simple</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Create, track, and manage professional invoices with multilingual support. 
                  Perfect for freelancers and businesses in Morocco and beyond.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-4"
                  onClick={() => window.location.href = '/login'}
                >
                  Join Beta Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-4"
                  onClick={() => scrollToSection('features')}
                >
                  Learn More
                </Button>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Free forever plan
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Setup in 2 minutes
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Invoice #1001</h3>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Paid</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Client:</span>
                      <span className="font-medium">Acme Corp</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-bold text-blue-600">2,500 MAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due Date:</span>
                      <span className="font-medium">Dec 30, 2024</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex gap-2">
                      <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm">PDF</div>
                      <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">Email Sent</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 shadow-lg">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold">94%</div>
                  <div className="text-sm opacity-90">Paid on Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Everything you need to manage invoices
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From creating professional invoices to tracking payments and managing clients, 
              Fatoora provides all the tools your business needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-6`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Join our beta for free access
            </h2>
            <p className="text-xl text-gray-600">
              Get early access to Fatoora and help us build the perfect invoice management solution.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative border-2 ${plan.color} ${plan.popular ? 'ring-2 ring-blue-500 ring-offset-2' : ''} hover:shadow-xl transition-all duration-300 ${plan.comingSoon ? 'opacity-75' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Beta Access
                    </span>
                  </div>
                )}
                {plan.comingSoon && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Coming Soon
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-gray-900">
                      {typeof plan.price.monthly === 'string' ? (
                        plan.price.monthly
                      ) : (
                        <>
                          ${plan.price[billingCycle]}
                          <span className="text-lg font-normal text-gray-500">
                            /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                          </span>
                        </>
                      )}
                    </div>
                    {!plan.comingSoon && plan.price.monthly === "Free" && (
                      <div className="text-sm text-green-600 font-medium">
                        Free during beta period
                      </div>
                    )}
                    {plan.comingSoon && (
                      <div className="text-sm text-gray-500">
                        Pricing to be announced
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mt-4">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Check className={`h-5 w-5 flex-shrink-0 ${plan.comingSoon ? 'text-gray-400' : 'text-green-500'}`} />
                        <span className={plan.comingSoon ? 'text-gray-500' : 'text-gray-600'}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' 
                        : plan.comingSoon
                        ? 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed'
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                    onClick={() => {
                      if (plan.comingSoon) return;
                      window.location.href = '/login';
                    }}
                    disabled={plan.comingSoon}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Loved by businesses across Morocco
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers have to say about Fatoora
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                      <div className="text-sm text-gray-500">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about Fatoora
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`} />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-white">
              Ready to join our beta?
            </h2>
            <p className="text-xl text-blue-100">
              Get early access to Fatoora and help us build the perfect invoice management solution
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
                onClick={() => window.location.href = '/login'}
              >
                Join Beta for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4"
                onClick={() => scrollToSection('features')}
              >
                Learn More
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                2-minute setup
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Secure & reliable
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">🧾</span>
                </div>
                <span className="text-2xl font-bold">Fatoora</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Modern, multilingual invoice management made simple. 
                Built for businesses in Morocco and beyond.
              </p>
              <div className="flex gap-4">
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2024 Fatoora. All rights reserved.
            </p>
            <p className="text-gray-400 mt-4 md:mt-0">
              Made with ❤️ for businesses everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing; 