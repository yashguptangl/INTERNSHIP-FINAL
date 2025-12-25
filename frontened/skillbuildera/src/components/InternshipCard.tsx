import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, ArrowRight } from 'lucide-react';
import { InternshipProgram } from '@/types/internship';

interface InternshipCardProps {
  program: InternshipProgram;
  index: number;
}

const InternshipCard = ({ program, index }: InternshipCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="h-full glass-card hover-lift group overflow-hidden">
        {/* Gradient Border Top */}
        <div className="h-1.5 gradient-bg" />
        
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
              {program.icon}
            </div>
            <Badge variant="remote" className="text-xs">
              <MapPin className="w-3 h-3 mr-1" />
              {program.mode}
            </Badge>
          </div>
          <h3 className="text-xl font-bold text-foreground mt-4 group-hover:text-primary transition-colors">
            {program.title}
          </h3>
        </CardHeader>

        <CardContent className="pb-4">
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            {program.description}
          </p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Clock className="w-4 h-4 text-primary" />
            <span>{program.duration}</span>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {program.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {program.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{program.skills.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <a href={program.formLink} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button variant="gradient" className="w-full group/btn">
              Apply Now
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </a>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default InternshipCard;
