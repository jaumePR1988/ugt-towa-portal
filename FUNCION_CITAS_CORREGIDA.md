async function handleConfirmBooking() {
  if (!user || !selectedSlot) return;

  setIsBooking(true);

  try {
    // ✅ CAMPOS CORREGIDOS para el esquema de base de datos actual
    const { data: newAppointment, error } = await supabase
      .from('appointments')
      .insert([{
        user_id: user.id,
        slot_id: selectedSlot.id,
        delegate_type: selectedType,
        
        // ✅ CAMPO CORRECTO:
        appointment_date: selectedSlot.appointment_date,
        appointment_time: selectedSlot.start_time,
        
        // ✅ CAMPOS OPCIONALES (pueden ser null)
        comments: comments || null,
        questions: questions || null,
        documents: uploadedFiles.length > 0 ? uploadedFiles : null,
        
        status: 'confirmed'
      }])
      .select()
      .single();
