
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, Save, User, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { zodiacSigns } from '@/utils/zodiacData';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [zodiacSign, setZodiacSign] = useState('');
  const [favoriteSigns, setFavoriteSigns] = useState<string[]>([]);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }
        setUser(user);
        
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
          toast({
            title: "Error",
            description: "Failed to load your profile",
            variant: "destructive",
          });
        }
        
        if (profile) {
          setProfile(profile);
          setUsername(profile.username || '');
          setZodiacSign(profile.zodiac_sign || '');
        }
        
        // Fetch favorite signs
        const { data: favorites, error: favoritesError } = await supabase
          .from('favorite_signs')
          .select('sign_name')
          .eq('user_id', user.id);
          
        if (favoritesError) {
          console.error('Error fetching favorites:', favoritesError);
        }
        
        if (favorites) {
          setFavoriteSigns(favorites.map(fav => fav.sign_name));
        }
      } catch (error) {
        console.error('Session error:', error);
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [navigate]);

  const saveProfile = async () => {
    if (!user) return;
    
    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          zodiac_sign: zodiacSign,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setProfile({
        ...profile,
        username,
        zodiac_sign: zodiacSign
      });
      
      setEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]">
        <div className="card-glass p-8 text-center">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="bg-zodiac-mystic-purple/20 text-zodiac-mystic-purple text-2xl">
                  {username ? username.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-medium">
                {username || user?.email?.split('@')[0] || 'User'}
              </h3>
              <p className="text-sm text-white/70">{user?.email}</p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setEditing(!editing)}
              >
                {editing ? (
                  <>Cancel</>
                ) : (
                  <>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="glass">
            <CardHeader>
              <CardTitle>{editing ? 'Edit Profile' : 'Profile Information'}</CardTitle>
              <CardDescription>
                {editing 
                  ? 'Update your personal information'
                  : 'Your cosmic identity and preferences'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {editing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter a username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zodiac">Your Zodiac Sign</Label>
                    <Select value={zodiacSign} onValueChange={setZodiacSign}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your sign" />
                      </SelectTrigger>
                      <SelectContent>
                        {zodiacSigns.map((sign) => (
                          <SelectItem key={sign.name} value={sign.name}>
                            {sign.symbol} {sign.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <User className="h-5 w-5 text-white/70" />
                    <div>
                      <h4 className="text-sm font-medium text-white/70">Username</h4>
                      <p>{username || 'Not set'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-xl">✨</span>
                    <div>
                      <h4 className="text-sm font-medium text-white/70">Zodiac Sign</h4>
                      <p>{zodiacSign || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {editing && (
                <div className="pt-4">
                  <Button 
                    className="w-full bg-zodiac-mystic-purple hover:bg-zodiac-mystic-purple/80"
                    onClick={saveProfile}
                    disabled={savingProfile}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {savingProfile ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="glass mt-6">
            <CardHeader>
              <CardTitle>Favorite Signs</CardTitle>
              <CardDescription>
                Signs you've liked while browsing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {favoriteSigns.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {favoriteSigns.map((sign) => {
                    const signData = zodiacSigns.find(s => s.name === sign);
                    return (
                      <div 
                        key={sign} 
                        className="flex items-center p-3 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg"
                          style={{ backgroundColor: signData?.color + '20', color: signData?.color }}
                        >
                          {signData?.symbol || '★'}
                        </div>
                        <span>{sign}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-white/70">
                  <Heart className="h-12 w-12 mb-3 stroke-1" />
                  <p className="mb-2">You haven't liked any signs yet</p>
                  <p className="text-sm">Swipe right on signs you like to add them to your favorites</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
