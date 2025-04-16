
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Download, FileBarChart } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const reportTypes = [
  { id: 'sales', label: 'Sales Report' },
  { id: 'quickbooks', label: 'QuickBooks Export' },
  { id: 'products', label: 'Orders by Product' },
  { id: 'clients', label: 'Orders by Client' },
  { id: 'profit', label: 'Gross Profit by Client' },
];

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleGenerateReport = () => {
    // In a real app, this would call an API endpoint to generate the report
    console.log('Generating report:', {
      type: selectedReport,
      startDate,
      endDate,
    });
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header 
          title="Reports" 
          subtitle="Generate and download reports"
          icon={FileBarChart}
        />
        
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6 p-6 bg-white rounded-lg shadow-sm border">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Generate Report</h2>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Type</label>
                  <Select value={selectedReport} onValueChange={setSelectedReport}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((report) => (
                        <SelectItem key={report.id} value={report.id}>
                          {report.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <Button 
                  className="w-full sm:w-auto"
                  onClick={handleGenerateReport}
                  disabled={!selectedReport || !startDate || !endDate}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
