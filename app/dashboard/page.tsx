"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, Briefcase, Settings, MessageSquare } from "lucide-react";
import { getContacts, type ContactData } from "@/lib/api/contacts";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export default function Dashboard() {
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getContacts();
        setContacts(Array.isArray(data) ? data : []);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch contacts",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Recent Contact Requests
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  No contact requests found.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.slice(0, 5).map((contact, index) => (
                    <TableRow key={contact._id || index}>
                      <TableCell className="font-medium">
                        {contact.name}
                      </TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>
                        {contact.createdAt
                          ? formatDate(contact.createdAt)
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
