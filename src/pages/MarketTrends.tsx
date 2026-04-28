import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EmployeeShell from '@/components/employee/EmployeeShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Star,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

// ---------- Mock data (demo only) ----------
const monthlyRevenue = [
  { month: 'May', bnb: 8200, localAvg: 7100, retailerAvg: 14200 },
  { month: 'Jun', bnb: 9450, localAvg: 7400, retailerAvg: 14600 },
  { month: 'Jul', bnb: 10800, localAvg: 8100, retailerAvg: 15100 },
  { month: 'Aug', bnb: 11200, localAvg: 8400, retailerAvg: 15300 },
  { month: 'Sep', bnb: 12100, localAvg: 8900, retailerAvg: 15800 },
  { month: 'Oct', bnb: 13400, localAvg: 9200, retailerAvg: 16100 },
  { month: 'Nov', bnb: 15800, localAvg: 9700, retailerAvg: 17400 },
  { month: 'Dec', bnb: 18200, localAvg: 10800, retailerAvg: 19200 },
  { month: 'Jan', bnb: 14600, localAvg: 9200, retailerAvg: 15400 },
  { month: 'Feb', bnb: 13900, localAvg: 9000, retailerAvg: 15100 },
  { month: 'Mar', bnb: 15200, localAvg: 9500, retailerAvg: 15800 },
  { month: 'Apr', bnb: 16400, localAvg: 9900, retailerAvg: 16300 },
];

const categoryPerformance = [
  { category: 'Denim', units: 142, revenue: 8900, margin: 62 },
  { category: 'Tees & Tops', units: 218, revenue: 7200, margin: 71 },
  { category: 'Outerwear', units: 56, revenue: 9400, margin: 58 },
  { category: 'Footwear', units: 89, revenue: 6800, margin: 54 },
  { category: 'Accessories', units: 174, revenue: 4100, margin: 68 },
  { category: 'Workwear', units: 71, revenue: 5600, margin: 64 },
];

const trendingBrands = [
  { brand: "Levi's", momentum: 28, avgPrice: 68, volume: 'High' },
  { brand: 'Carhartt', momentum: 41, avgPrice: 82, volume: 'High' },
  { brand: 'Dickies', momentum: 19, avgPrice: 38, volume: 'Med' },
  { brand: 'Nike Vintage', momentum: 52, avgPrice: 124, volume: 'Med' },
  { brand: 'Polo Ralph Lauren', momentum: 33, avgPrice: 56, volume: 'High' },
  { brand: 'Harley Davidson', momentum: 47, avgPrice: 95, volume: 'Med' },
  { brand: 'Champion', momentum: -8, avgPrice: 42, volume: 'Low' },
  { brand: 'Tommy Hilfiger', momentum: 24, avgPrice: 48, volume: 'Med' },
];

const competitorRadar = [
  { metric: 'Pricing', bnb: 88, local: 72, retailer: 55 },
  { metric: 'Curation', bnb: 92, local: 68, retailer: 45 },
  { metric: 'Selection', bnb: 74, local: 70, retailer: 95 },
  { metric: 'Authenticity', bnb: 95, local: 78, retailer: 40 },
  { metric: 'Community', bnb: 90, local: 65, retailer: 30 },
  { metric: 'Online Reach', bnb: 68, local: 58, retailer: 98 },
];

const localCompetitors = [
  { name: 'Black & Brown', revenue: 16400, growth: 18.4, rating: 4.9, type: 'us' },
  { name: 'Moon Zooom', revenue: 14200, growth: 7.1, rating: 4.6, type: 'local' },
  { name: 'Five Spot Vintage', revenue: 11800, growth: 4.3, rating: 4.5, type: 'local' },
  { name: 'Treasure Island', revenue: 9600, growth: -2.1, rating: 4.3, type: 'local' },
  { name: 'Crossroads Trading', revenue: 22400, growth: 6.8, rating: 4.2, type: 'chain' },
  { name: 'Buffalo Exchange', revenue: 26100, growth: 5.4, rating: 4.1, type: 'chain' },
];

const customerSplit = [
  { name: 'Locals (SJ)', value: 58 },
  { name: 'Bay Area', value: 27 },
  { name: 'Tourists', value: 11 },
  { name: 'Online', value: 4 },
];

const PIE_COLORS = ['hsl(var(--foreground))', 'hsl(var(--muted-foreground))', 'hsl(var(--charcoal))', 'hsl(var(--divider))'];

// ---------- Components ----------
const StatCard = ({
  label,
  value,
  delta,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  delta: number;
  icon: React.ComponentType<{ className?: string }>;
  hint: string;
}) => {
  const positive = delta >= 0;
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              positive ? 'text-foreground' : 'text-destructive'
            }`}
          >
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {positive ? '+' : ''}
            {delta}%
          </div>
        </div>
        <p className="text-2xl font-serif text-foreground mb-1">{value}</p>
        <p className="text-xs text-muted-foreground tracking-wide uppercase mb-2">{label}</p>
        <p className="text-xs text-muted-foreground/80 leading-relaxed">{hint}</p>
      </CardContent>
    </Card>
  );
};

const MarketTrends = () => {
  const { user, isEmployee, loading } = useAuth();
  const [range, setRange] = useState<'3m' | '6m' | '12m'>('12m');

  const filteredRevenue = useMemo(() => {
    const slice = range === '3m' ? -3 : range === '6m' ? -6 : -12;
    return monthlyRevenue.slice(slice);
  }, [range]);

  const totalRevenue = filteredRevenue.reduce((s, m) => s + m.bnb, 0);
  const totalLocal = filteredRevenue.reduce((s, m) => s + m.localAvg, 0);
  const vsLocalPct = ((totalRevenue - totalLocal) / totalLocal) * 100;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground tracking-wide">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (!isEmployee) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <section className="py-24 text-center container mx-auto px-4 max-w-md">
          <h2 className="font-serif text-2xl tracking-wide uppercase mb-4">Access Pending</h2>
          <div className="section-divider-decorated mb-6" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Market Trends is for employees only.
          </p>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="font-serif text-2xl md:text-3xl font-light text-foreground tracking-wide uppercase mb-4">
              Market Trends
            </h1>
            <div className="section-divider-decorated mb-6" />
            <p className="text-sm text-muted-foreground tracking-wide max-w-xl mx-auto">
              Sales performance, category insights, and how Black &amp; Brown stacks up against local
              vintage shops and major retailers.
            </p>
          </div>

          {/* Range selector */}
          <div className="flex justify-end mb-6">
            <Select value={range} onValueChange={(v) => setRange(v as typeof range)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3m">Last 3 months</SelectItem>
                <SelectItem value="6m">Last 6 months</SelectItem>
                <SelectItem value="12m">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard
              label="Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              delta={18.4}
              icon={DollarSign}
              hint="Trailing period total"
            />
            <StatCard
              label="vs Local Avg"
              value={`+${vsLocalPct.toFixed(1)}%`}
              delta={11.2}
              icon={TrendingUp}
              hint="Outperforming SJ vintage shops"
            />
            <StatCard
              label="Units Sold"
              value="750"
              delta={9.7}
              icon={ShoppingBag}
              hint="Across all categories"
            />
            <StatCard
              label="Repeat Customers"
              value="42%"
              delta={6.1}
              icon={Users}
              hint="Within 90-day window"
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="sales" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="compare">Compare</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>

            {/* SALES */}
            <TabsContent value="sales" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg font-light tracking-wide uppercase">
                    Revenue Over Time
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Monthly revenue compared to the average of nearby vintage shops and major resale chains.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={filteredRevenue}>
                        <defs>
                          <linearGradient id="bnbFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                        <Tooltip
                          contentStyle={{
                            background: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            fontSize: '12px',
                          }}
                          formatter={(v: number) => `$${v.toLocaleString()}`}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        <Area
                          type="monotone"
                          dataKey="bnb"
                          name="Black & Brown"
                          stroke="hsl(var(--foreground))"
                          fill="url(#bnbFill)"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="localAvg"
                          name="Local Vintage Avg"
                          stroke="hsl(var(--muted-foreground))"
                          strokeWidth={1.5}
                          strokeDasharray="4 4"
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="retailerAvg"
                          name="Major Retailer Avg"
                          stroke="hsl(var(--charcoal))"
                          strokeWidth={1.5}
                          strokeDasharray="2 2"
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-lg font-light tracking-wide uppercase">
                      Revenue by Category
                    </CardTitle>
                    <CardDescription className="text-xs">Where the money is coming from.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryPerformance} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                          <YAxis
                            type="category"
                            dataKey="category"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={11}
                            width={90}
                          />
                          <Tooltip
                            contentStyle={{
                              background: 'hsl(var(--background))',
                              border: '1px solid hsl(var(--border))',
                              fontSize: '12px',
                            }}
                            formatter={(v: number) => `$${v.toLocaleString()}`}
                          />
                          <Bar dataKey="revenue" fill="hsl(var(--foreground))" radius={[0, 2, 2, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-lg font-light tracking-wide uppercase">
                      Margin by Category
                    </CardTitle>
                    <CardDescription className="text-xs">Tees and accessories carry the highest margin.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 pt-2">
                      {categoryPerformance.map((c) => (
                        <div key={c.category}>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-foreground tracking-wide">{c.category}</span>
                            <span className="text-muted-foreground tabular-nums">{c.margin}%</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-foreground transition-all"
                              style={{ width: `${c.margin}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* COMPARE */}
            <TabsContent value="compare" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg font-light tracking-wide uppercase">
                    Competitive Position
                  </CardTitle>
                  <CardDescription className="text-xs">
                    How Black &amp; Brown compares on the dimensions that matter to vintage shoppers.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[360px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={competitorRadar}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }} />
                        <PolarRadiusAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <Radar
                          name="Black & Brown"
                          dataKey="bnb"
                          stroke="hsl(var(--foreground))"
                          fill="hsl(var(--foreground))"
                          fillOpacity={0.4}
                        />
                        <Radar
                          name="Local Vintage Avg"
                          dataKey="local"
                          stroke="hsl(var(--muted-foreground))"
                          fill="hsl(var(--muted-foreground))"
                          fillOpacity={0.15}
                        />
                        <Radar
                          name="Major Retailer Avg"
                          dataKey="retailer"
                          stroke="hsl(var(--charcoal))"
                          fill="hsl(var(--charcoal))"
                          fillOpacity={0.1}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        <Tooltip
                          contentStyle={{
                            background: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            fontSize: '12px',
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg font-light tracking-wide uppercase">
                    Local &amp; Chain Benchmarks
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Estimated monthly revenue, growth, and customer rating for nearby competitors.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {localCompetitors.map((c) => {
                      const isUs = c.type === 'us';
                      const positive = c.growth >= 0;
                      return (
                        <div
                          key={c.name}
                          className={`flex items-center justify-between gap-4 p-4 border ${
                            isUs ? 'border-foreground bg-secondary/40' : 'border-border'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-serif text-sm text-foreground tracking-wide">{c.name}</span>
                              {isUs && (
                                <Badge variant="default" className="text-[9px] uppercase tracking-wider">
                                  Us
                                </Badge>
                              )}
                              {c.type === 'chain' && (
                                <Badge variant="outline" className="text-[9px] uppercase tracking-wider">
                                  National Chain
                                </Badge>
                              )}
                              {c.type === 'local' && (
                                <Badge variant="secondary" className="text-[9px] uppercase tracking-wider">
                                  Local
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-current" />
                                {c.rating}
                              </span>
                              <span
                                className={`flex items-center gap-0.5 ${
                                  positive ? 'text-foreground' : 'text-destructive'
                                }`}
                              >
                                {positive ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : (
                                  <TrendingDown className="h-3 w-3" />
                                )}
                                {positive ? '+' : ''}
                                {c.growth}%
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-serif text-base text-foreground tabular-nums">
                              ${c.revenue.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                              Monthly Est.
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TRENDS */}
            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg font-light tracking-wide uppercase">
                    Trending Brands
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Demand momentum vs. last quarter. Use this to guide buying decisions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trendingBrands
                      .sort((a, b) => b.momentum - a.momentum)
                      .map((b) => {
                        const positive = b.momentum >= 0;
                        return (
                          <div key={b.brand} className="flex items-center gap-4 p-3 border border-border">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-serif text-sm text-foreground">{b.brand}</span>
                                <Badge variant="outline" className="text-[9px] uppercase tracking-wider">
                                  {b.volume} Volume
                                </Badge>
                              </div>
                              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all ${
                                    positive ? 'bg-foreground' : 'bg-destructive'
                                  }`}
                                  style={{ width: `${Math.min(Math.abs(b.momentum) * 1.8, 100)}%` }}
                                />
                              </div>
                            </div>
                            <div className="text-right min-w-[80px]">
                              <p
                                className={`text-sm font-medium tabular-nums flex items-center justify-end gap-1 ${
                                  positive ? 'text-foreground' : 'text-destructive'
                                }`}
                              >
                                {positive ? (
                                  <ArrowUpRight className="h-3 w-3" />
                                ) : (
                                  <ArrowDownRight className="h-3 w-3" />
                                )}
                                {positive ? '+' : ''}
                                {b.momentum}%
                              </p>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                ${b.avgPrice} avg
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-secondary/40">
                  <CardContent className="pt-6">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                      Insight
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      <strong className="font-serif">Vintage Nike</strong> is the fastest-rising category
                      in San Jose — up 52% this quarter. Stock more sportswear.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/40">
                  <CardContent className="pt-6">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                      Insight
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      <strong className="font-serif">Outerwear</strong> drives the highest revenue per
                      unit but lowest margin. Negotiate harder on intake.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/40">
                  <CardContent className="pt-6">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                      Insight
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      <strong className="font-serif">Champion</strong> demand is cooling (-8%). Reduce
                      buy-ins and clear existing stock.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* CUSTOMERS */}
            <TabsContent value="customers" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-lg font-light tracking-wide uppercase">
                      Customer Mix
                    </CardTitle>
                    <CardDescription className="text-xs">Where shoppers are coming from.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={customerSplit}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            innerRadius={50}
                            label={(e) => `${e.value}%`}
                            labelLine={false}
                            style={{ fontSize: '11px' }}
                          >
                            {customerSplit.map((_, i) => (
                              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              background: 'hsl(var(--background))',
                              border: '1px solid hsl(var(--border))',
                              fontSize: '12px',
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '11px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-lg font-light tracking-wide uppercase">
                      Foot Traffic vs. Sales
                    </CardTitle>
                    <CardDescription className="text-xs">Conversion has stayed steady at ~38%.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={filteredRevenue.map((m, i) => ({
                          month: m.month,
                          traffic: 800 + i * 30 + (i % 2 === 0 ? 60 : 0),
                          sales: Math.round(m.bnb / 55),
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                          <Tooltip
                            contentStyle={{
                              background: 'hsl(var(--background))',
                              border: '1px solid hsl(var(--border))',
                              fontSize: '12px',
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '11px' }} />
                          <Line
                            type="monotone"
                            dataKey="traffic"
                            name="Visitors"
                            stroke="hsl(var(--muted-foreground))"
                            strokeWidth={1.5}
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="sales"
                            name="Transactions"
                            stroke="hsl(var(--foreground))"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg font-light tracking-wide uppercase">
                    Customer Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                      <p className="text-2xl font-serif text-foreground">$58</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                        Avg Basket
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-serif text-foreground">2.3</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                        Items per Sale
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-serif text-foreground">38%</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                        Conversion
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-serif text-foreground">4.9</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                        Avg Rating
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-12 space-y-2 text-center">
            <p className="text-[10px] text-muted-foreground/60 tracking-wide uppercase">
              Demo data shown for illustrative purposes
            </p>
            <p className="text-[11px] text-muted-foreground/80 italic max-w-xl mx-auto leading-relaxed">
              Disclaimer: In-person sales may vary in price from figures shown here. Tagged prices in store reflect current promotions, negotiations, and condition adjustments at the time of sale.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MarketTrends;
