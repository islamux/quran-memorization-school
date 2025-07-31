# Project To-Do List
## Rules
* Always using pnpm in project.
* Make changes, as easy as i can.
* Make codes is simple as you can.
* 

## Immediate Tasks
- [x] Fix translation issues.
- [x] translation names of students, teachers.
- [x] Fix errors in project : ex  src/[Locales]/students/page.tsx
- [] When the page load : could you install the app in your device.
- []  Fix dublicate of data source --> mokdata,Dexie. 
- [] Delete mokdata. because it's only for testing.
- [] Try using SQLite 
- [] Be sure of using dixie, or not
- [] Analyze the project from time to time .
- []  Monthly, Semi-year, Yearly reports.

## Features to Develop
- [ ] Develop schedule management feature
- [ ] Add teacher-student interaction module

## Improvements
- [ ] Optimize database queries 
- [ ] تناسق الاكودا للتطبيق
هل يتم اتباع نفس الطريقة في كل الملفات ام كل ملف يتم تطبيق حلول مختلفه بسبب نماذج الذكاء الاصطناعي المختلفة
- التاكد من عرض كارد المعلم بنفس طريقة كارد الطالب
لاني لاحظت ان التعديل على الخبرة في المعلم في مكان مختلف وليس بنفس التنسيق كما في الطالب "السورة ..."
- [ ] Enhance UI/UX for mobile devices
- [ ] Add Android app support 
- [x] هناك ازدوج في استخدام قاعدة البيانات - تم الحل
- ✅ تم استبدال SQLite و localStorage بـ Dexie.js (IndexedDB)
- ✅ Dexie.js توفر قاعدة بيانات محلية سريعة ومتوافقة مع Next.js
- [] التاكد من تنظيف المشروع من الملفات الغير ضرورية خاصة من بعض الحلول الغير كاملة او التي لم تنجح وبقيت بعض ملفاتها 
مثلا استخدمت burbllewarp , 
- لانشاء ملف apk هناك بعض الملفات التي تم انشاءها من قبل burbllewarp , 
- هناك ايضا capcitorjs
- 
🚨 المشاكل الرئيسية:

#### 1. ازدواجية في نظام إدارة البيانات ⚠️
•  يوجد ملفان للـ Context: DataContext.tsx و DexieDataContext.tsx
•  بعض الملفات تستخدم DataContext والبعض الآخر يستخدم DexieDataContext
•  هناك 3 أنظمة تخزين مختلفة:
•  localStorage (في DataContext.tsx)
•  Dexie/IndexedDB (في DexieDataContext.tsx)
•  SQLite (معطل في database.ts)

#### 2. ملفات غير مكتملة أو غير ضرورية 📁
•  ملف database.ts يحتوي على كود SQLite معطل
•  وجود ملفات Android/Gradle (من BubbleWrap أو TWA)
•  ملفات build مؤقتة في المستودع

#### 3. عدم اتساق في استخدام Context 🔄
•  بعض الصفحات تستورد من DataContext وأخرى من DexieDataContext
•  هذا يسبب أخطاء "useData must be used within a DataProvider"

#### 4. مشاكل في الهيكلة 🏗️
•  وجود mockData يُستخدم كبيانات افتراضية رغم وجود قاعدة بيانات
•  عدم وضوح أي نظام تخزين هو الأساسي


## Long-term Goals
- [] PWA (Progressive Web App)
- [] Android Native version (kotlin)    
- [] Android ReactNative.
- 




*Prioritize tasks based on project needs and progress.*

