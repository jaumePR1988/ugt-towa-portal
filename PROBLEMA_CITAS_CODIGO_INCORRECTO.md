async function handleConfirmBooking() {
  if (!user || !selectedSlot) return;

  setIsBooking(true);

  try {
    const { data: newAppointment, error } = await supabase
      .from('appointments')
      .insert([{
        user_id: user.id,
        slot_id: selectedSlot.id,
        delegate_type: selectedType,
        // ❌ CAMPOS INCORRECTOS:
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        // ❌ ESTO CAUSA "record new has no field date"
        
        status: 'confirmed',
        comments: comments || null,
        questions: questions || null,
        documents: uploadedFiles.length > 0 ? uploadedFiles : null,
      }])
      .select()
      .single();
