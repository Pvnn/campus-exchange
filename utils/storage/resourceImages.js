import { createClient } from '@/utils/supabase/client'

export const uploadResourceImage = async (file, resourceId, userId) => {
  const supabase = createClient()
  
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}_${resourceId}_${Date.now()}.${fileExt}`
    const filePath = `resources/${fileName}`
    
    const { data, error } = await supabase.storage
      .from('resource-images')
      .upload(filePath, file)
    
    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('resource-images')
      .getPublicUrl(filePath)
    
    return {
      path: filePath,
      url: publicUrl,
      size: file.size,
      type: file.type
    }
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}

export const deleteResourceImage = async (imagePath) => {
  const supabase = createClient()
  
  try {
    const { error } = await supabase.storage
      .from('resource-images')
      .remove([imagePath])
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Delete error:', error)
    throw error
  }
}
