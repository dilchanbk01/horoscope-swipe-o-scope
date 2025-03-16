
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogIn, User, LogOut, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AuthButtonProps {
  user: any | null;
}

const AuthButton: React.FC<AuthButtonProps> = ({ user }) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  // If user is not logged in, show login button
  if (!user) {
    return (
      <Link to="/auth">
        <Button variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/10">
          <LogIn className="h-4 w-4" />
          <span className="hidden sm:inline">Sign In</span>
        </Button>
      </Link>
    );
  }
  
  // If user is logged in, show user menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full border-white/20 p-0 w-10 h-10">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-zodiac-mystic-purple/20 text-zodiac-mystic-purple">
              {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">{user.email || 'User'}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {user.id.substring(0, 8)}...
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex cursor-pointer items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex cursor-pointer items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="flex cursor-pointer items-center text-destructive focus:text-destructive"
          disabled={isLoggingOut}
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthButton;
