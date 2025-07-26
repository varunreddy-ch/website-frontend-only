import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { User, FileText, Download, Calendar, Edit } from "lucide-react";

export default function Profile() {
  // Mock user data - replace with actual auth implementation
  const [userInfo, setUserInfo] = useState({
    firstname: "John",
    lastname: "Doe", 
    email: "john.doe@example.com",
    role: "user"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstname: userInfo?.firstname || "",
    lastname: userInfo?.lastname || "",
    email: userInfo?.email || "",
  });
  const [generatedResumes, setGeneratedResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserResumes();
  }, []);

  const fetchUserResumes = async () => {
    try {
      // Mock data for demonstration - replace with actual API call
      setGeneratedResumes([
        {
          id: 1,
          company: "Google",
          position: "Software Engineer",
          createdAt: "2024-01-15",
          status: "downloaded",
        },
        {
          id: 2,
          company: "Microsoft",
          position: "Frontend Developer",
          createdAt: "2024-01-10",
          status: "generated",
        },
        {
          id: 3,
          company: "Apple",
          position: "Full Stack Developer",
          createdAt: "2024-01-05",
          status: "downloaded",
        },
      ]);
    } catch (err) {
      setError("Failed to fetch resume history");
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserInfo({ ...userInfo, ...formData });
      setMessage("✅ Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError("❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      generated: "bg-blue-100 text-blue-800 border-blue-200",
      downloaded: "bg-green-100 text-green-800 border-green-200",
    };
    
    return (
      <Badge className={variants[status] || "bg-gray-100 text-gray-800"}>
        {status === "downloaded" ? "📥 Downloaded" : "📄 Generated"}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />

      {message && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in">
            {message}
          </div>
        </div>
      )}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold gradient-text">My Profile</h1>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="bg-white/80 backdrop-blur-sm"
          >
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information Card */}
          <Card className="lg:col-span-1 bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-xl">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Full Name</Label>
                    <p className="font-medium">{userInfo?.firstname} {userInfo?.lastname}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{userInfo?.email}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Role</Label>
                    <Badge className="bg-blue-100 text-blue-800">
                      {userInfo?.role === "admin" ? "👑 Admin" : "🙋 User"}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="firstname">First Name</Label>
                    <Input
                      id="firstname"
                      value={formData.firstname}
                      onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastname">Last Name</Label>
                    <Input
                      id="lastname"
                      value={formData.lastname}
                      onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    >
                      {loading ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Resume History Card */}
          <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Resume History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedResumes.length > 0 ? (
                <div className="space-y-3">
                  {generatedResumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {resume.position} at {resume.company}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {new Date(resume.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(resume.status)}
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-blue-50"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No resumes generated yet.</p>
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="mt-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Generate Your First Resume
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">{generatedResumes.length}</p>
              <p className="text-blue-100">Total Resumes</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6 text-center">
              <Download className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {generatedResumes.filter(r => r.status === "downloaded").length}
              </p>
              <p className="text-green-100">Downloaded</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {generatedResumes.length > 0 
                  ? Math.max(...generatedResumes.map(r => 
                      Math.floor((new Date().getTime() - new Date(r.createdAt).getTime()) / (1000 * 60 * 60 * 24))
                    ))
                  : 0
                }
              </p>
              <p className="text-purple-100">Days Since Last</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}