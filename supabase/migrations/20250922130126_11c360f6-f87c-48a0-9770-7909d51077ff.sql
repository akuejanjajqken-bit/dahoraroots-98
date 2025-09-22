-- Create coupons table
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  max_uses INTEGER NOT NULL DEFAULT 1,
  current_uses INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Create policies for coupons
CREATE POLICY "Anyone can view active coupons" 
ON public.coupons 
FOR SELECT 
USING (active = true);

CREATE POLICY "Admins can manage all coupons" 
ON public.coupons 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_coupons_updated_at
BEFORE UPDATE ON public.coupons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to validate coupon usage
CREATE OR REPLACE FUNCTION public.use_coupon(coupon_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  coupon_record RECORD;
  result JSONB;
BEGIN
  -- Get coupon details
  SELECT * INTO coupon_record 
  FROM public.coupons 
  WHERE code = coupon_code 
    AND active = true 
    AND valid_until > now()
    AND current_uses < max_uses;
  
  -- Check if coupon exists and is valid
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'Cupom inválido ou expirado'
    );
  END IF;
  
  -- Increment usage count
  UPDATE public.coupons 
  SET current_uses = current_uses + 1,
      updated_at = now()
  WHERE id = coupon_record.id;
  
  -- Return coupon details
  RETURN jsonb_build_object(
    'valid', true,
    'discount_percentage', coupon_record.discount_percentage,
    'product_id', coupon_record.product_id,
    'code', coupon_record.code
  );
END;
$$;