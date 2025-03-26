import React from "react";
import Layout from "@/components/Layout";
import GlassCard from "@/components/GlassCard";
import AnimatedTitle from "@/components/AnimatedTitle";
import { useAuth } from "@/contexts/AuthContext";
import { TeamMember } from "@/types";
import { Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const BASE_PATH = "/rsa--shield/";

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "mentor1",
    name: "Dr. Ishu Sharma",
    image: `${BASE_PATH}Mentor.jpg`,
    bio: "Dr. Ishu Sharma is an experienced Associate Professor specializing in Computer Science, with a strong background in research, blockchain, and cybersecurity. She has extensive experience in the education management industry, mentoring students and professionals in cutting-edge technologies. As the project mentor for RSA Shield, Dr. Ishu provides expert guidance in cybersecurity and fraud detection, helping shape the project's development and implementation strategies. Her research expertise enhances the project's ability to tackle online scams and fraud prevention effectively. Her leadership and deep technical knowledge make her a valuable asset to the RSA Shield initiative, ensuring it aligns with industry standards and emerging security trends.",
    isMentor: true,
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/ishu-sharma/",
    },
    details: {
      designation: "Associate Professor",
    },
  },
  {
    id: "student1",
    name: "Nirmal Haldar",
    image: `${BASE_PATH}student1.jpg`,
    bio: "Web 3 enthusiast and full-stack developer with a strong focus on secure application development.",
    isMentor: false,
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/itz-nirmal",
    },
    details: {
      rollNumber: "2330161",
      course: "B.Tech",
      stream: "Computer Science",
      section: "C",
      semester: "4th",
    },
  },
  {
    id: "student2",
    name: "Vibhor Singh",
    image: `${BASE_PATH}student2.jpg`,
    bio: "Software Engineering student with interests in cybersecurity and secure system design.",
    isMentor: false,
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/vibhor-singh-810b52291",
    },
    details: {
      rollNumber: "2330225",
      course: "B.Tech",
      stream: "Computer Science",
      section: "D",
      semester: "4th",
    },
  },
  {
    id: "student3",
    name: "Sambit Sinha",
    image: `${BASE_PATH}student3.jpg`,
    bio: "Computer Science Student passionate about cryptography and blockchain technology.",
    isMentor: false,
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/sambit-sinha-73936b284",
    },
    details: {
      rollNumber: "2330196",
      course: "B.Tech",
      stream: "Computer Science",
      section: "C",
      semester: "4th",
    },
  },
];

const SocialIcon: React.FC<{
  platform: "linkedin";
  url: string;
}> = ({ platform, url }) => {
  const icons = {
    linkedin: <Linkedin className="h-5 w-5" />,
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/50 hover:bg-indigo-600/80 transition-colors"
    >
      {icons[platform]}
      <span className="text-sm">Connect on LinkedIn</span>
    </a>
  );
};

const MentorCard: React.FC<{ mentor: TeamMember }> = ({ mentor }) => {
  return (
    <GlassCard className="max-w-2xl mx-auto mb-12 text-center">
      <div className="flex flex-col items-center">
        <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-indigo-400/30">
          <img
            src={mentor.image}
            alt={mentor.name}
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="text-2xl font-bold mb-1">{mentor.name}</h3>
        <p className="text-indigo-300 text-sm mb-2">Mentor</p>
        <p className="text-indigo-300 mb-4">{mentor.details?.designation}</p>

        <p className="text-white/80 mb-6 max-w-lg text-justify px-4">
          {mentor.bio}
        </p>

        <div className="flex gap-4 mt-2">
          {mentor.socialLinks.linkedin && (
            <SocialIcon platform="linkedin" url={mentor.socialLinks.linkedin} />
          )}
        </div>
      </div>
    </GlassCard>
  );
};

const StudentCard: React.FC<{ student: TeamMember }> = ({ student }) => {
  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <GlassCard className="h-full">
            <div className="flex flex-col items-center h-full justify-between p-4">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-3 border-2 border-indigo-400/30">
                <img
                  src={student.image}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-xl font-bold mb-1">{student.name}</h3>
              <p className="text-indigo-300 text-sm mb-2">Student</p>
              <p className="text-white/80 text-center mb-3 text-sm text-justify px-2">
                {student.bio}
              </p>
            </div>
          </GlassCard>
        </div>

        <div className="flip-card-back">
          <GlassCard className="h-full" variant="neo">
            <div className="flex flex-col h-full justify-center p-4">
              <h3 className="text-xl font-bold mb-4 text-center">
                {student.name}
              </h3>

              <div className="space-y-2 mb-6">
                <p className="flex justify-between">
                  <span className="font-medium">Roll Number:</span>
                  <span>{student.details?.rollNumber}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Course:</span>
                  <span>{student.details?.course}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Stream:</span>
                  <span>{student.details?.stream}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Section:</span>
                  <span>{student.details?.section}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Semester:</span>
                  <span>{student.details?.semester}</span>
                </p>
              </div>

              {student.socialLinks.linkedin && (
                <div className="flex justify-center mt-auto pt-3">
                  <SocialIcon
                    platform="linkedin"
                    url={student.socialLinks.linkedin}
                  />
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

const Team = () => {
  const { isAuthenticated } = useAuth();
  const mentor = TEAM_MEMBERS.find((member) => member.isMentor);
  const students = TEAM_MEMBERS.filter((member) => !member.isMentor);

  return (
    <Layout isLoggedIn={isAuthenticated}>
      <div className="container mx-auto px-4 py-12">
        <AnimatedTitle subtitle="The People Behind RSA Shield">
          Meet The Team
        </AnimatedTitle>

        <div className="max-w-6xl mx-auto">
          {mentor && <MentorCard mentor={mentor} />}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {students.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Team;
