// Browser Console Script to Reset the Database
// Copy and paste this entire script into your browser console

(async function resetDatabase() {
  console.log('🔄 Starting database reset...');
  
  try {
    // First, delete the existing database
    const deleteRequest = indexedDB.deleteDatabase('QuranSchoolDB');
    
    deleteRequest.onsuccess = async () => {
      console.log('✅ Old database deleted successfully');
      
      // Wait a moment for the deletion to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Now reload the page to reinitialize with default data
      console.log('🔄 Reloading page to initialize with default data...');
      window.location.reload();
    };
    
    deleteRequest.onerror = () => {
      console.error('❌ Error deleting database');
    };
    
    deleteRequest.onblocked = () => {
      console.warn('⚠️ Database deletion blocked. Please close all tabs using this app and try again.');
    };
    
  } catch (error) {
    console.error('❌ Error in reset process:', error);
  }
})();
