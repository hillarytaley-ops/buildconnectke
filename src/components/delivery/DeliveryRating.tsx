import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Star, Send, CheckCircle } from "lucide-react";

interface DeliveryRatingProps {
  deliveryId: string;
  deliveryData?: {
    tracking_number: string;
    material_type: string;
    driver_name?: string;
  };
  onRatingSubmitted?: () => void;
}

const DeliveryRating: React.FC<DeliveryRatingProps> = ({
  deliveryId,
  deliveryData,
  onRatingSubmitted
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const categories = [
    { value: 'delivery', label: 'Delivery Service' },
    { value: 'driver', label: 'Driver Performance' },
    { value: 'timeliness', label: 'Timeliness' },
    { value: 'communication', label: 'Communication' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmitRating = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from('feedback')
        .insert([{
          delivery_id: deliveryId,
          rating,
          comment: comment.trim() || null,
          category
        }]);

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Rating Submitted",
        description: "Thank you for your feedback! Your rating helps us improve our service.",
      });

      onRatingSubmitted?.();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit your rating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="border-success/20 bg-success/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-3 text-center">
            <CheckCircle className="h-8 w-8 text-success" />
            <div>
              <h3 className="font-semibold text-success">Rating Submitted!</h3>
              <p className="text-sm text-muted-foreground">Thank you for your feedback</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-warning" />
          Rate This Delivery
        </CardTitle>
        <CardDescription>
          Help us improve by rating your delivery experience
        </CardDescription>
        {deliveryData && (
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {deliveryData.tracking_number}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {deliveryData.material_type}
            </Badge>
            {deliveryData.driver_name && (
              <Badge variant="outline" className="text-xs">
                Driver: {deliveryData.driver_name}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Star Rating */}
        <div className="space-y-2">
          <Label>Overall Rating</Label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110"
                disabled={isSubmitting}
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    star <= (hoverRating || rating)
                      ? 'fill-warning text-warning'
                      : 'text-muted-foreground hover:text-warning/50'
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-muted-foreground">
                {rating} out of 5 stars
              </span>
            )}
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-2">
          <Label>Category</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Badge
                key={cat.value}
                variant={category === cat.value ? "default" : "secondary"}
                className="cursor-pointer px-3 py-1 transition-colors hover:bg-primary/80"
                onClick={() => setCategory(cat.value)}
              >
                {cat.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <Label htmlFor="comment">Additional Comments (Optional)</Label>
          <Textarea
            id="comment"
            placeholder="Tell us about your delivery experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            disabled={isSubmitting}
            className="resize-none"
          />
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmitRating}
          disabled={rating === 0 || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Send className="h-4 w-4 mr-2 animate-pulse" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit Rating
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DeliveryRating;