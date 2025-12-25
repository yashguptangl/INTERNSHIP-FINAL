import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Users,
  Mail,
  Award,
  Search,
  FileText,
  Download,
  Eye,
  LogOut,
  LayoutDashboard,
  RefreshCw,
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  Send,
  MessageSquare,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Intern } from '@/types/internship';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { internsAPI, contactAPI } from '@/lib/api';
import OfferLetterTemplate from '@/components/templates/OfferLetterTemplate';
import CertificateTemplate from '@/components/templates/CertificateTemplate';

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logout, admin } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [interns, setInterns] = useState<Intern[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [previewType, setPreviewType] = useState<'offer' | 'certificate' | null>(null);
  const [previewHTML, setPreviewHTML] = useState<string>('');
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('interns');
  const [internStatusTab, setInternStatusTab] = useState('new');
  const [contactStatusTab, setContactStatusTab] = useState('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0,
  });
  const [contactStats, setContactStats] = useState({
    total: 0,
    new: 0,
    read: 0,
    responded: 0,
  });

  const domains = ['MERN Stack', 'Java Development', 'Data Science', 'AI/ML', 'Cyber Security'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const phases = ['1', '2', '3'];

  // Fetch interns from backend
  const fetchInterns = async () => {
    try {
      setIsLoading(true);
      const response = await internsAPI.getAll();
      if (response.success) {
        setInterns(response.data);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch interns',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await internsAPI.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const response = await contactAPI.getAll();
      if (response.success) {
        setContacts(response.data);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch contacts',
        variant: 'destructive',
      });
    }
  };

  // Fetch contact stats
  const fetchContactStats = async () => {
    try {
      const response = await contactAPI.getStats();
      if (response.success) {
        setContactStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch contact stats:', error);
    }
  };

  useEffect(() => {
    fetchInterns();
    fetchStats();
    fetchContacts();
    fetchContactStats();
  }, []);

  // Filter interns based on tab, domain, month, phase, and search
  const filteredInterns = interns.filter((intern) => {
    // Tab filter - categorize based on offer/certificate status
    if (internStatusTab === 'new' && intern.offerLetterSent) {
      return false;
    }
    if (internStatusTab === 'offer-sent' && (!intern.offerLetterSent || intern.certificateSent)) {
      return false;
    }
    if (internStatusTab === 'completed' && !intern.certificateSent) {
      return false;
    }

    // Domain filter
    if (selectedDomain !== 'all' && intern.domain !== selectedDomain) {
      return false;
    }

    // Month filter
    if (selectedMonth !== 'all') {
      const startDate = new Date(intern.startDate);
      const monthIndex = startDate.getMonth();
      if (months[monthIndex] !== selectedMonth) {
        return false;
      }
    }

    // Phase filter
    if (selectedPhase !== 'all' && intern.phase.toString() !== selectedPhase) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        intern.name.toLowerCase().includes(query) ||
        intern.employeeId.toLowerCase().includes(query) ||
        intern.email.toLowerCase().includes(query) ||
        intern.domain.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Calculate dynamic counts for each tab
  const newApplicationsCount = interns.filter(i => !i.offerLetterSent).length;
  const offerSentCount = interns.filter(i => i.offerLetterSent && !i.certificateSent).length;
  const completedCount = interns.filter(i => i.certificateSent).length;

  // Filter contacts based on status and search
  const filteredContacts = contacts.filter((contact) => {
    // Status filter
    if (contactStatusTab !== 'all' && contact.status !== contactStatusTab) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        contact.name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.subject.toLowerCase().includes(query) ||
        contact.message.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const handleSendOfferLetter = async (intern: Intern) => {
    try {
      const internId = (intern as any)._id || intern.id;
      const response = await internsAPI.sendOfferLetter(internId);
      if (response.success) {
        await fetchInterns();
        await fetchStats();
        toast({
          title: 'Offer Letter Sent!',
          description: `Offer letter has been sent to ${intern.name}`,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send offer letter',
        variant: 'destructive',
      });
    }
  };

  const handleSendCertificate = async (intern: Intern) => {
    try {
      const internId = (intern as any)._id || intern.id;
      const response = await internsAPI.sendCertificate(internId);
      if (response.success) {
        await fetchInterns();
        await fetchStats();
        toast({
          title: 'Certificate Sent!',
          description: `Certificate has been sent to ${intern.name}`,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send certificate',
        variant: 'destructive',
      });
    }
  };

  const handlePreview = async (intern: Intern, type: 'offer' | 'certificate') => {
    setSelectedIntern(intern);
    setPreviewType(type);
    setIsLoadingPreview(true);
    
    try {
      const internId = (intern as any)._id || intern.id;
      const html = type === 'offer' 
        ? await internsAPI.previewOfferLetter(internId)
        : await internsAPI.previewCertificate(internId);
      setPreviewHTML(html);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load preview',
        variant: 'destructive',
      });
      setSelectedIntern(null);
      setPreviewType(null);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully',
    });
    navigate('/admin/login');
  };

  const handleUpdateContactStatus = async (contactId: string, status: 'new' | 'read' | 'responded') => {
    try {
      const response = await contactAPI.updateStatus(contactId, status);
      if (response.success) {
        await fetchContacts();
        await fetchContactStats();
        toast({
          title: 'Status Updated',
          description: 'Contact status has been updated successfully',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update contact status',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      const response = await contactAPI.delete(contactId);
      if (response.success) {
        await fetchContacts();
        await fetchContactStats();
        toast({
          title: 'Contact Deleted',
          description: 'Contact has been deleted successfully',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete contact',
        variant: 'destructive',
      });
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

  const internStatsCards = [
    { label: 'Total Interns', value: stats.total, icon: Users, color: 'text-primary' },
    { label: 'New Applications', value: newApplicationsCount, icon: Clock, color: 'text-amber-500' },
    { label: 'Offer Sent', value: offerSentCount, icon: Send, color: 'text-blue-500' },
    { label: 'Completed', value: completedCount, icon: CheckCircle, color: 'text-emerald-500' },
  ];

  const contactStatsCards = [
    { label: 'Total Messages', value: contactStats.total, icon: MessageSquare, color: 'text-purple-500' },
    { label: 'New Messages', value: contactStats.new, icon: Mail, color: 'text-red-500' },
    { label: 'Read', value: contactStats.read, icon: Eye, color: 'text-blue-500' },
    { label: 'Responded', value: contactStats.responded, icon: CheckCircle, color: 'text-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">T</span>
              </div>
              <div>
                <h1 className="font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground">Welcome, {admin?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => {
                fetchInterns();
                fetchContacts();
                fetchContactStats();
              }}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Main Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="interns">
                <Users className="w-4 h-4 mr-2" />
                Interns ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="contacts">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contacts ({contactStats.total})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {(activeTab === 'interns' ? internStatsCards : contactStatsCards).map((stat) => (
            <Card 
              key={stat.label} 
              className="glass-card hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Interns Table */}
        {activeTab === 'interns' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle>Intern Management</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search interns..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Domains</SelectItem>
                      {domains.map((domain) => (
                        <SelectItem key={domain} value={domain}>
                          {domain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <Calendar className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Months</SelectItem>
                      {months.map((month) => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Phase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Phases</SelectItem>
                      {phases.map((phase) => (
                        <SelectItem key={phase} value={phase}>
                          Phase {phase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {(selectedDomain !== 'all' || selectedMonth !== 'all' || selectedPhase !== 'all') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedDomain('all');
                        setSelectedMonth('all');
                        setSelectedPhase('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>

                {/* Tabs */}
                <Tabs value={internStatusTab} onValueChange={setInternStatusTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                    <TabsTrigger value="new">
                      <Clock className="w-4 h-4 mr-1" />
                      New ({newApplicationsCount})
                    </TabsTrigger>
                    <TabsTrigger value="offer-sent">
                      <Send className="w-4 h-4 mr-1" />
                      Offer Sent ({offerSentCount})
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Completed ({completedCount})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredInterns.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No interns found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Domain</TableHead>
                        <TableHead className="hidden lg:table-cell">Phase</TableHead>
                        <TableHead className="hidden xl:table-cell">Start Date</TableHead>
                        <TableHead className="hidden xl:table-cell">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInterns.map((intern) => (
                        <TableRow key={(intern as any)._id || intern.id}>
                          <TableCell className="font-mono text-sm text-primary">
                            {intern.employeeId}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">{intern.name}</p>
                              <p className="text-xs text-muted-foreground">{intern.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="secondary">{intern.domain}</Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <Badge variant="phase">Phase {intern.phase}</Badge>
                          </TableCell>
                          <TableCell className="hidden xl:table-cell text-sm">
                            {formatDate(intern.startDate)}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            {!intern.offerLetterSent ? (
                              <Badge variant="warning" className="flex items-center gap-1 w-fit">
                                <Clock className="w-3 h-3" />
                                New
                              </Badge>
                            ) : !intern.certificateSent ? (
                              <Badge variant="info" className="flex items-center gap-1 w-fit">
                                <Send className="w-3 h-3" />
                                Offer Sent
                              </Badge>
                            ) : (
                              <Badge variant="success" className="flex items-center gap-1 w-fit">
                                <CheckCircle className="w-3 h-3" />
                                Completed
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              {/* New Application - Show Send Offer Letter */}
                              {!intern.offerLetterSent && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePreview(intern, 'offer')}
                                    title="Preview Offer Letter"
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    Preview
                                  </Button>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleSendOfferLetter(intern)}
                                    className="bg-blue-500 hover:bg-blue-600"
                                    title="Send Offer Letter"
                                  >
                                    <Mail className="w-3 h-3 mr-1" />
                                    Send Offer
                                  </Button>
                                </>
                              )}
                              
                              {/* Offer Sent - Show Send Certificate */}
                              {intern.offerLetterSent && !intern.certificateSent && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handlePreview(intern, 'offer')}
                                    title="View Offer Letter"
                                  >
                                    <FileText className="w-3 h-3 mr-1" />
                                    Offer
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePreview(intern, 'certificate')}
                                    title="Preview Certificate"
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    Preview
                                  </Button>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleSendCertificate(intern)}
                                    className="bg-emerald-500 hover:bg-emerald-600"
                                    title="Send Certificate"
                                  >
                                    <Award className="w-3 h-3 mr-1" />
                                    Send Cert
                                  </Button>
                                </>
                              )}
                              
                              {/* Completed - View Both */}
                              {intern.certificateSent && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handlePreview(intern, 'offer')}
                                    title="View Offer Letter"
                                  >
                                    <FileText className="w-3 h-3 mr-1" />
                                    Offer
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handlePreview(intern, 'certificate')}
                                    title="View Certificate"
                                  >
                                    <Award className="w-3 h-3 mr-1" />
                                    Cert
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        )}

        {/* Contacts Table */}
        {activeTab === 'contacts' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle>Contact Messages</CardTitle>
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Contact Status Tabs */}
                <Tabs value={contactStatusTab} onValueChange={setContactStatusTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All ({contactStats.total})</TabsTrigger>
                    <TabsTrigger value="new">
                      <Mail className="w-4 h-4 mr-1" />
                      New ({contactStats.new})
                    </TabsTrigger>
                    <TabsTrigger value="read">
                      <Eye className="w-4 h-4 mr-1" />
                      Read ({contactStats.read})
                    </TabsTrigger>
                    <TabsTrigger value="responded">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Responded ({contactStats.responded})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No contact messages found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="hidden md:table-cell">Subject</TableHead>
                        <TableHead className="hidden lg:table-cell">Date</TableHead>
                        <TableHead className="hidden xl:table-cell">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContacts.map((contact) => (
                        <TableRow key={contact.id} className={contact.status === 'new' ? 'bg-primary/5' : ''}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">{contact.name}</p>
                              {contact.phone && (
                                <p className="text-xs text-muted-foreground">{contact.phone}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{contact.email}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <p className="text-sm font-medium truncate max-w-[200px]">{contact.subject}</p>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm">
                            {formatDate(contact.createdAt)}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            {contact.status === 'new' ? (
                              <Badge variant="warning" className="flex items-center gap-1 w-fit">
                                <Mail className="w-3 h-3" />
                                New
                              </Badge>
                            ) : contact.status === 'read' ? (
                              <Badge variant="info" className="flex items-center gap-1 w-fit">
                                <Eye className="w-3 h-3" />
                                Read
                              </Badge>
                            ) : (
                              <Badge variant="success" className="flex items-center gap-1 w-fit">
                                <CheckCircle className="w-3 h-3" />
                                Responded
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedContact(contact)}
                                title="View Message"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                              {contact.status !== 'responded' && (
                                <Select
                                  value={contact.status}
                                  onValueChange={(value) => handleUpdateContactStatus(contact.id, value as any)}
                                >
                                  <SelectTrigger className="w-[110px] h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="read">Read</SelectItem>
                                    <SelectItem value="responded">Responded</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteContact(contact.id)}
                                title="Delete Message"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        )}
      </main>

      {/* Contact Detail Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Message</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-foreground font-medium">{selectedContact.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-foreground">{selectedContact.email}</p>
                </div>
              </div>
              {selectedContact.phone && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-foreground">{selectedContact.phone}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subject</label>
                <p className="text-foreground font-medium">{selectedContact.subject}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Message</label>
                <div className="mt-2 p-4 bg-muted/50 rounded-lg">
                  <p className="text-foreground whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    {selectedContact.status === 'new' ? (
                      <Badge variant="warning">New</Badge>
                    ) : selectedContact.status === 'read' ? (
                      <Badge variant="info">Read</Badge>
                    ) : (
                      <Badge variant="success">Responded</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Received</label>
                  <p className="text-foreground">{formatDate(selectedContact.createdAt)}</p>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedContact(null)}
                >
                  Close
                </Button>
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => {
                    window.location.href = `mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`;
                  }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Reply via Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!selectedIntern && !!previewType} onOpenChange={() => { 
        setSelectedIntern(null); 
        setPreviewType(null); 
        setPreviewHTML('');
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {previewType === 'offer' ? 'Offer Letter Preview' : 'Certificate Preview'}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {isLoadingPreview ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div 
                className="border rounded-lg p-4"
                dangerouslySetInnerHTML={{ __html: previewHTML }}
              />
            )}
          </div>
          <div className="flex justify-between gap-3 mt-4">
            <Button variant="outline" onClick={() => { 
              setSelectedIntern(null); 
              setPreviewType(null); 
              setPreviewHTML('');
            }}>
              Close
            </Button>
            <div className="flex gap-3">
              {selectedIntern && previewType === 'offer' && !selectedIntern.offerLetterSent && (
                <Button 
                  variant="default"
                  onClick={async () => {
                    await handleSendOfferLetter(selectedIntern);
                    setSelectedIntern(null);
                    setPreviewType(null);
                    setPreviewHTML('');
                  }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Offer Letter
                </Button>
              )}
              {selectedIntern && previewType === 'certificate' && !selectedIntern.certificateSent && (
                <Button 
                  variant="default"
                  onClick={async () => {
                    await handleSendCertificate(selectedIntern);
                    setSelectedIntern(null);
                    setPreviewType(null);
                    setPreviewHTML('');
                  }}
                >
                  <Award className="w-4 h-4 mr-2" />
                  Send Certificate
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
