import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertParticipantSchema, type InsertParticipant, type Participant } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Trophy } from "lucide-react";

export default function Registration() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<InsertParticipant>({
    resolver: zodResolver(insertParticipantSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertParticipant) => {
      return await apiRequest<Participant>("POST", "/api/register", data);
    },
    onSuccess: (response) => {
      toast({
        title: "Registration Successful!",
        description: "Get ready to spin the wheel!",
      });
      setLocation(`/spin/${response.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertParticipant) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-chart-2/10 via-transparent to-transparent" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary/30 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-chart-2/30 rounded-full animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-chart-3/30 rounded-full animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-primary/20 rounded-full animate-float" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 flex flex-col items-center justify-center min-h-screen">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-6">
          <div className="inline-block mb-6">
            <div className="flex items-center justify-center gap-4 mb-6">
              {/* Logo Container - Replace with your Tantra 2025 logo */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl shadow-primary/50">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                  <span className="text-2xl md:text-3xl font-display font-bold text-primary-foreground">
                    TANTRA
                    <br />
                    2025
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-8 h-8 md:w-12 md:h-12 text-primary animate-pulse" />
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-chart-2 animate-pulse" style={{ animationDelay: "0.5s" }} />
            </div>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent animate-float">
            Vimal Jyothi Tech Fest
          </h1>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm">
            <div className="w-2 h-2 bg-chart-3 rounded-full animate-pulse" />
            <span className="font-display text-lg md:text-xl text-foreground">
              October 24, 2025
            </span>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-body max-w-2xl mx-auto">
            Register & Spin to Win Free Event Passes!
          </p>
        </div>

        {/* Registration Card */}
        <div className="w-full max-w-md">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-chart-2 to-primary rounded-2xl blur-xl opacity-30" />
            
            {/* Glass card */}
            <div className="relative backdrop-blur-xl bg-card/80 border border-card-border rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Join the Fest
                </h2>
                <p className="text-sm text-muted-foreground">
                  Fill in your details to get started
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your full name"
                            className="h-12 bg-background/50 border-input focus:border-primary transition-colors"
                            data-testid="input-name"
                            disabled={registerMutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">WhatsApp Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-chart-3 font-semibold">
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                            </div>
                            <Input
                              {...field}
                              type="tel"
                              placeholder="+919876543210"
                              className="h-12 pl-12 bg-background/50 border-input focus:border-primary transition-colors"
                              data-testid="input-phone"
                              disabled={registerMutation.isPending}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 bg-gradient-to-r from-primary to-chart-2 hover:from-primary/90 hover:to-chart-2/90 text-primary-foreground font-semibold text-base shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                    disabled={registerMutation.isPending}
                    data-testid="button-register"
                  >
                    {registerMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        <span>Registering...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        <span>Register & Spin</span>
                      </div>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-8 pt-6 border-t border-border/50 text-center">
                <p className="text-sm text-muted-foreground">
                  🎉 Limited event passes available
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust indicator */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Secure registration • Instant results • Free entry
          </p>
        </div>
      </div>
    </div>
  );
}
