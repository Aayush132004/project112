// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mmqsuosezwbhwkeirjds.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tcXN1b3NlendiaHdrZWlyamRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1Mjc1NzAsImV4cCI6MjA1MjEwMzU3MH0.HuwwpfMj4czJ0_rYMC6RqvD020qboWNAP3V7SR6d7Jc'; // Replace with your Supabase anonymous API key

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };