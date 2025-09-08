import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zmjzlnsxohckkowlcigq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptanpsbnN4b2hja2tvd2xjaWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMjEwMDMsImV4cCI6MjA3Mjg5NzAwM30.jVVdfUZ2Hz5Yzz8Mnvzuzdom7KpedDY9soxR94k4lP0'

export const supabase = createClient(supabaseUrl, supabaseKey)