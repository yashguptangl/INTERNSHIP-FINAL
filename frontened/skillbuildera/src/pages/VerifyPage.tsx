import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, User, Calendar, Award, Briefcase, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Intern } from '@/types/internship';
import { internsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const VerifyPage = () => {
  const { toast } = useToast();
  const [employeeId, setEmployeeId] = useState('');
  const [searchResult, setSearchResult] = useState<Intern | null>(null);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = employeeId.trim().toUpperCase();
    
    if (!trimmedId) {
      toast({
        title: 'Error',
        description: 'Please enter an employee ID',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setSearched(false);
    
    try {
      const response = await internsAPI.getByEmployeeId(trimmedId);
      if (response.success) {
        setSearchResult(response.data);
      } else {
        setSearchResult(null);
      }
    } catch (error: any) {
      setSearchResult(null);
      if (error.response?.status !== 404) {
        toast({
          title: 'Error',
          description: 'Failed to verify employee ID. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setSearched(true);
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'active':
        return <Badge variant="info">Active</Badge>;
      default:
        return <Badge variant="warning">Pending</Badge>;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 sm:pt-24 pb-16 sm:pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center mb-8 sm:mb-12"
          >
            <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              Certificate Verification
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Verify <span className="gradient-text">Internship Credentials</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground px-2">
              Enter your Employee ID to verify your internship details and certificate authenticity.
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-xl mx-auto mb-8 sm:mb-12"
          >
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <Input
                  placeholder="Enter Employee ID (e.g., MERN-25-P1-K9VX)"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="pl-9 sm:pl-10 h-11 sm:h-12 text-sm sm:text-base"
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                variant="gradient" 
                className="h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </Button>
            </form>
          </motion.div>

          {/* Search Results */}
          {searched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              {searchResult ? (
                <Card className="glass-card overflow-hidden">
                  <div className="h-1.5 sm:h-2 gradient-bg" />
                  <CardHeader className="text-center pb-3 sm:pb-4 px-4 sm:px-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <User className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl sm:text-2xl">{searchResult.name}</CardTitle>
                    <p className="font-mono text-primary text-xs sm:text-sm break-all">{searchResult.employeeId}</p>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6">
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      {getStatusBadge(searchResult.status)}
                      <Badge variant="phase">Phase {searchResult.phase}</Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/50 border border-border">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                          <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                          <span className="text-xs sm:text-sm text-muted-foreground">Domain</span>
                        </div>
                        <p className="font-semibold text-sm sm:text-base text-foreground">{searchResult.domain}</p>
                      </div>

                      <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/50 border border-border">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                          <span className="text-xs sm:text-sm text-muted-foreground">Duration</span>
                        </div>
                        <p className="font-semibold text-sm sm:text-base text-foreground">4 Weeks</p>
                      </div>

                      <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/50 border border-border">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                          <span className="text-xs sm:text-sm text-muted-foreground">Start Date</span>
                        </div>
                        <p className="font-semibold text-sm sm:text-base text-foreground">{formatDate(searchResult.startDate)}</p>
                      </div>

                      <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/50 border border-border">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                          <span className="text-xs sm:text-sm text-muted-foreground">End Date</span>
                        </div>
                        <p className="font-semibold text-sm sm:text-base text-foreground">{formatDate(searchResult.endDate)}</p>
                      </div>
                    </div>

                    {/* Document Status */}
                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border">
                      <h4 className="font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">Document Status</h4>
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                        <div className="flex items-center gap-2">
                          {searchResult.offerLetterSent ? (
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                          ) : (
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                          )}
                          <span className="text-xs sm:text-sm">Offer Letter</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {searchResult.certificateSent ? (
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                          ) : (
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                          )}
                          <span className="text-xs sm:text-sm">Certificate</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-xs sm:text-sm text-emerald-600">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="font-medium">Verified Skillbuild Era Intern</span>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="glass-card text-center py-8 sm:py-12">
                  <CardContent className="px-4 sm:px-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Search className="w-6 h-6 sm:w-8 sm:h-8 text-destructive" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                      No Record Found
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                      We couldn't find any internship record with the Employee ID "{employeeId}". 
                      Please check the ID and try again.
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mt-12 sm:mt-16"
          >
            <div className="p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4 text-center">
                📋 Employee ID Format
              </h3>
              <p className="text-center text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                Your unique Employee ID follows this format:
              </p>
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap px-2">
                <Badge variant="secondary" className="text-xs sm:text-sm px-2 sm:px-4 py-0.5 sm:py-1">Domain</Badge>
                <span className="text-muted-foreground text-xs sm:text-base">-</span>
                <Badge variant="secondary" className="text-xs sm:text-sm px-2 sm:px-4 py-0.5 sm:py-1">Year</Badge>
                <span className="text-muted-foreground text-xs sm:text-base">-</span>
                <Badge variant="phase" className="text-xs sm:text-sm px-2 sm:px-4 py-0.5 sm:py-1">Phase</Badge>
                <span className="text-muted-foreground text-xs sm:text-base">-</span>
                <Badge variant="info" className="text-xs sm:text-sm px-2 sm:px-4 py-0.5 sm:py-1">Suffix</Badge>
              </div>
              <p className="text-center text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
                Example: MERN-25-P1-K9VX (MERN Stack, 2025, Phase 1)
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VerifyPage;
