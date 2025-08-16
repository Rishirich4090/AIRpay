import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";

interface PlaceholderProps {
  title: string;
}

export default function Placeholder({ title }: PlaceholderProps) {
  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto mt-20">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <Construction className="w-6 h-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              This page is under construction. Continue prompting to have the content generated for this section.
            </p>
            <Button variant="outline" className="w-full">
              Request Page Content
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
