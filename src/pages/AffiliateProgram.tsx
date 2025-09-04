import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Share2,
  Star
} from 'lucide-react';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';

interface Referral {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'active' | 'converted' | 'paid';
  commission: number;
  date: string;
  conversionDate?: string;
  paymentDate?: string;
  subscriptionType: string;
  monthlyValue: number;
}

interface AffiliateStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  monthlyEarnings: number;
  conversionRate: number;
  pendingPayout: number;
  lifetimeEarnings: number;
  thisMonthReferrals: number;
  averageCommission: number;
}

interface PaymentHistory {
  id: string;
  amount: number;
  date: string;
  status: 'pending' | 'paid' | 'failed';
  method: string;
  reference: string;
}

const AffiliateProgram = () => {
  const [referrals, _setReferrals] = useState<Referral[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      status: 'paid',
      commission: 25.00,
      date: '2024-01-15',
      conversionDate: '2024-01-20',
      paymentDate: '2024-02-01',
      subscriptionType: 'Pro Plan',
      monthlyValue: 99.00
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@example.com',
      status: 'converted',
      commission: 49.50,
      date: '2024-01-14',
      conversionDate: '2024-01-18',
      subscriptionType: 'Business Plan',
      monthlyValue: 199.00
    },
    {
      id: '3',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      status: 'active',
      commission: 0,
      date: '2024-01-13',
      subscriptionType: 'Free Trial',
      monthlyValue: 0
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david.w@example.com',
      status: 'pending',
      commission: 0,
      date: '2024-01-12',
      subscriptionType: 'Free Trial',
      monthlyValue: 0
    },
    {
      id: '5',
      name: 'Lisa Brown',
      email: 'lisa.brown@example.com',
      status: 'paid',
      commission: 74.25,
      date: '2024-01-10',
      conversionDate: '2024-01-15',
      paymentDate: '2024-02-01',
      subscriptionType: 'Enterprise Plan',
      monthlyValue: 299.00
    }
  ]);

  const [stats, setStats] = useState<AffiliateStats>({
    totalReferrals: 45,
    activeReferrals: 12,
    totalEarnings: 1250.00,
    monthlyEarnings: 325.00,
    conversionRate: 26.7,
    pendingPayout: 148.75,
    lifetimeEarnings: 3420.50,
    thisMonthReferrals: 8,
    averageCommission: 27.8
  });

  const [paymentHistory, _setPaymentHistory] = useState<PaymentHistory[]>([
    {
      id: '1',
      amount: 325.00,
      date: '2024-02-01',
      status: 'paid',
      method: 'PayPal',
      reference: 'PAY-2024-001'
    },
    {
      id: '2',
      amount: 280.50,
      date: '2024-01-01',
      status: 'paid',
      method: 'PayPal',
      reference: 'PAY-2024-002'
    },
    {
      id: '3',
      amount: 148.75,
      date: '2024-03-01',
      status: 'pending',
      method: 'PayPal',
      reference: 'PAY-2024-003'
    }
  ]);

  const [affiliateLink] = useState('https://aiorchestrator.com/ref/ABC123');
  const [copied, setCopied] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('paypal');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(affiliateLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleRequestPayout = () => {
    if (stats.pendingPayout >= 50) {
      setShowPaymentModal(true);
    } else {
      alert('Minimum payout amount is $50. Current pending amount: $' + stats.pendingPayout.toFixed(2));
    }
  };

  const handleConfirmPayout = () => {
    // Simulate payout processing
    alert(`Payout of $${stats.pendingPayout.toFixed(2)} has been initiated to your ${selectedPaymentMethod} account. You will receive it within 3-5 business days.`);
    setShowPaymentModal(false);
    // Update stats to reflect payout
    setStats(prev => ({
      ...prev,
      pendingPayout: 0,
      totalEarnings: prev.totalEarnings + prev.pendingPayout
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'converted': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'converted': return 'Converted';
      case 'active': return 'Active';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <Star className="h-4 w-4" />;
      case 'converted': return <TrendingUp className="h-4 w-4" />;
      case 'active': return <TrendingUp className="h-4 w-4" />;
      case 'pending': return <TrendingUp className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const earningsData = [
    { name: 'Jan', value: 280 },
    { name: 'Feb', value: 325 },
    { name: 'Mar', value: 148 },
    { name: 'Apr', value: 0 },
    { name: 'May', value: 0 },
    { name: 'Jun', value: 0 },
  ];

  const referralsData = [
    { name: 'Jan', value: 12 },
    { name: 'Feb', value: 8 },
    { name: 'Mar', value: 5 },
    { name: 'Apr', value: 0 },
    { name: 'May', value: 0 },
    { name: 'Jun', value: 0 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between py-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Affiliate Program</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track your referrals, earnings, and manage your affiliate links
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="inline-flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="inline-flex items-center">
              <Share2 className="w-4 h-4 mr-2" />
              Share Program
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Referrals</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalReferrals}</p>
                  <p className="text-xs text-green-600 mt-1">+{stats.thisMonthReferrals} this month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Lifetime Earnings</p>
                  <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.lifetimeEarnings)}</p>
                  <p className="text-xs text-green-600 mt-1">+{formatCurrency(stats.monthlyEarnings)} this month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending Payout</p>
                  <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.pendingPayout)}</p>
                  <p className="text-xs text-blue-600 mt-1">Min $50 to withdraw</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.conversionRate}%</p>
                  <p className="text-xs text-green-600 mt-1">+2.3% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Affiliate Link Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Your Affiliate Link
              </CardTitle>
              <p className="text-sm text-gray-500">
                Share this link to earn commissions
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={affiliateLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                />
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className="inline-flex items-center"
                >
                  <Star className="w-4 h-4 mr-1" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Commission Rate: 25%</span>
                <span>•</span>
                <span>Min Payout: $50</span>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">How it works</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Share your unique affiliate link with potential customers</li>
                  <li>• Earn 25% commission on all successful referrals</li>
                  <li>• Get paid monthly when you reach the $50 minimum</li>
                  <li>• Track your performance in real-time</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payout Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Request Payout
              </CardTitle>
              <p className="text-sm text-gray-500">
                Withdraw your earnings
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatCurrency(stats.pendingPayout)}
                </div>
                <p className="text-sm text-gray-500">Available for withdrawal</p>
              </div>
              
              <Button 
                onClick={handleRequestPayout}
                disabled={stats.pendingPayout < 50}
                className="w-full"
              >
                <Star className="w-4 h-4 mr-2" />
                Request Payout
              </Button>
              
              {stats.pendingPayout < 50 && (
                <p className="text-xs text-gray-500 text-center">
                  Minimum $50 required for payout
                </p>
              )}
              
              <div className="text-sm text-gray-600">
                <p>Next payout date: March 1, 2024</p>
                <p>Payment method: PayPal</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Performance
              </CardTitle>
              <p className="text-sm text-gray-500">
                This month's performance
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monthly Earnings</span>
                <span className="text-lg font-semibold text-gray-900">{formatCurrency(stats.monthlyEarnings)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Referrals</span>
                <span className="text-lg font-semibold text-gray-900">{stats.thisMonthReferrals}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg Commission</span>
                <span className="text-lg font-semibold text-gray-900">{formatCurrency(stats.averageCommission)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="text-lg font-semibold text-gray-900">{stats.conversionRate}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Trend</CardTitle>
              <p className="text-sm text-gray-500">
                Monthly earnings over time
              </p>
            </CardHeader>
            <CardContent>
              <LineChart data={earningsData} height={300} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Referrals Trend</CardTitle>
              <p className="text-sm text-gray-500">
                Monthly referrals over time
              </p>
            </CardHeader>
            <CardContent>
              <BarChart data={referralsData} height={300} />
            </CardContent>
          </Card>
        </div>

        {/* Referrals Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Referrals</CardTitle>
            <p className="text-sm text-gray-500">
              Track your referral performance
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Plan</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Commission</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((referral) => (
                    <tr key={referral.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{referral.name}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{referral.email}</td>
                      <td className="py-3 px-4 text-gray-700">{referral.subscriptionType}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(referral.status)}>
                          <div className="flex items-center">
                            {getStatusIcon(referral.status)}
                            <span className="ml-1">{getStatusText(referral.status)}</span>
                          </div>
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {referral.commission > 0 ? formatCurrency(referral.commission) : '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{referral.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <p className="text-sm text-gray-500">
              Your payout history and status
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Method</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-700">{payment.date}</td>
                      <td className="py-3 px-4 font-medium text-gray-900">{formatCurrency(payment.amount)}</td>
                      <td className="py-3 px-4 text-gray-700">{payment.method}</td>
                      <td className="py-3 px-4">
                        <Badge variant={payment.status === 'paid' ? 'default' : payment.status === 'pending' ? 'secondary' : 'destructive'}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{payment.reference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Request Payout</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payout Amount</label>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.pendingPayout)}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="paypal">PayPal</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="stripe">Stripe</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmPayout}
                  className="flex-1"
                >
                  Confirm Payout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffiliateProgram; 