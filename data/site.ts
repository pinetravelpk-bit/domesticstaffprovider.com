export const SITE = {
  brand: 'Domestic Staff Provider',
  domain: 'domesticstaffprovider.com',
  url: 'https://domesticstaffprovider.com',
  phoneDisplay: '0334 1041114',
  phone: '+923341041114',
  whatsapp: '923341041114',
  email: 'info@domesticstaffprovider.pk',
  office: 'Office 106, 1st Floor, Al Sahib Heights, E-11/4, Islamabad',
  company: 'Operated by Staffly',
};

export type Service = {slug:string;title:string;short:string;description:string;icon:string;image?:string;price?:string;features:string[];keywords:string[]};
export const services: Service[] = [
  {slug:'house-maids',title:'House Maids',short:'Full-time and part-time household help',description:'Household cleaning, laundry, regular upkeep and practical daily assistance with a clearly agreed duty list.',icon:'maid',image:'/images/maid-service.jpg',price:'From Rs. 40,000/mo',features:['Regular cleaning and upkeep','Laundry and household routines','Live-in or live-out arrangements'],keywords:['hire maid in Pakistan','house maid Islamabad']},
  {slug:'cooks-chefs',title:'Cooks & Chefs',short:'Home cooks and experienced chefs',description:'Cooks for everyday meals and chefs for specialized menus, meal planning, kitchen organization and family food preferences.',icon:'chef',image:'/images/cook-service.jpg',price:'From Rs. 35,000/mo',features:['Everyday family meals','Kitchen planning and hygiene','Specialist chef enquiries'],keywords:['hire cook Pakistan','home chef Islamabad']},
  {slug:'drivers',title:'Drivers',short:'Family and office drivers',description:'Experienced driving support for family transport, office journeys and agreed local routes.',icon:'driver',image:'/images/driver-service.jpg',price:'From Rs. 35,000/mo',features:['Family and personal drivers','Office and executive transport','Experience discussed before hiring'],keywords:['hire driver Pakistan','family driver Islamabad']},
  {slug:'home-nurses',title:'Home Nurses',short:'At-home nursing enquiries',description:'Home nursing enquiries coordinated around care needs and relevant professional qualifications.',icon:'nurse',features:['Patient care requirements','Relevant credentials discussed','Schedule and duties agreed'],keywords:['home nurse Pakistan','home nursing Islamabad']},
  {slug:'babysitters-nannies',title:'Babysitters & Nannies',short:'Childcare and nursery support',description:'Childcare support matched to children’s ages, routines, required experience and supervision needs.',icon:'baby',features:['Infant and toddler routines','After-school support','Clear childcare responsibilities'],keywords:['hire nanny Pakistan','babysitter Islamabad']},
  {slug:'caretakers-attendants',title:'Caretakers',short:'Elderly and home care support',description:'Non-medical companionship and practical daily living support for adults at home.',icon:'heart',features:['Companionship and mobility support','Daily routines','Family-coordinated schedules'],keywords:['elderly caretaker Pakistan','patient attendant Islamabad']},
  {slug:'cleaners',title:'Cleaners',short:'Home and office cleaning',description:'Cleaning staff for homes, offices and regular maintenance needs, with the work scope and schedule agreed in advance.',icon:'clean',features:['Home cleaning','Office cleaning','Agreed schedule and tasks'],keywords:['home cleaner Islamabad','office cleaner Pakistan']},
  {slug:'domestic-couples',title:'Domestic Couples',short:'Coordinated household support',description:'Two household positions coordinated together, with each role and salary arrangement defined individually.',icon:'couple',features:['Coordinated pair placements','Clear responsibilities per person','Live-in arrangements discussed'],keywords:['domestic couple Pakistan','household couple staff']},
  {slug:'helpers',title:'Household Helpers',short:'General everyday domestic support',description:'Extra help with household upkeep, serving, agreed errands and assistance around routine home activities.',icon:'helper',features:['Kitchen and general assistance','Serving and routine tasks','Schedules tailored to your household'],keywords:['house helper Pakistan','domestic helper Islamabad']},
  {slug:'security-guards',title:'Security Guards',short:'Household and property support',description:'Security staffing enquiries for defined access-control and reporting responsibilities.',icon:'shield',features:['Property access support','Shift planning','Reporting responsibilities'],keywords:['security guard Pakistan','home security staff Islamabad']},
  {slug:'gardeners',title:'Gardeners',short:'Garden and lawn maintenance',description:'Mali placements for plants, lawns, scheduled garden work and general outdoor upkeep.',icon:'garden',features:['Lawn care','Plant maintenance','Scheduled garden upkeep'],keywords:['mali hire Islamabad','gardener Pakistan']},
  {slug:'office-boys',title:'Office Boys',short:'Office and pantry assistance',description:'Workplace help for visitors, pantry service, documents, dispatch and daily business support.',icon:'briefcase',features:['Office pantry service','Visitor assistance','Dispatch and filing'],keywords:['office boy Islamabad','office helper Pakistan']},
  {slug:'personal-attendants',title:'Personal Attendants',short:'Personal support and errands',description:'Practical support for wardrobe care, packing, personal errands and household organization.',icon:'helper',features:['Wardrobe and packing','Agreed personal errands','Routine personal assistance'],keywords:['batman staff Pakistan','personal attendant Islamabad']},
  {slug:'chefs',title:'Specialist Chefs',short:'Special menus and entertaining',description:'Professional chef enquiries for menu planning, presentation and specialized family food requirements.',icon:'chef',features:['Menu planning','Specialist cooking','Formal entertaining'],keywords:['private chef Islamabad','hire chef Pakistan']},
];
export type City = {slug:string;name:string;intro:string;areas:string[]};
export const cities: City[] = [
  {slug:'islamabad',name:'Islamabad',intro:'Domestic staffing enquiries for Islamabad sectors, societies and nearby neighborhoods.',areas:['F-6','F-7','F-8','F-10','F-11','E-11','G-11','I-8','DHA Islamabad','Bahria Enclave']},
  {slug:'rawalpindi',name:'Rawalpindi',intro:'Household support across Rawalpindi’s residential areas and surrounding communities.',areas:['Bahria Town','DHA 1','DHA 2','Chaklala','Satellite Town','PWD','Gulraiz','Adyala Road','Saddar']},
  {slug:'lahore',name:'Lahore',intro:'Discuss domestic staff placements for Lahore households with our coordination team.',areas:['DHA','Gulberg','Johar Town','Model Town','Bahria Town','Wapda Town']},
  {slug:'karachi',name:'Karachi',intro:'Share your Karachi district, household requirements and working arrangement.',areas:['DHA','Clifton','Gulshan-e-Iqbal','PECHS','North Nazimabad','Bahria Town Karachi']},
  {slug:'faisalabad',name:'Faisalabad',intro:'Request appropriate home staff for families in Faisalabad and nearby areas.',areas:['Madina Town','People’s Colony','D Ground','Canal Road']},
  {slug:'multan',name:'Multan',intro:'Domestic staffing enquiries for Multan households.',areas:['Cantt','Gulgasht Colony','Bosan Road','DHA']},
  {slug:'peshawar',name:'Peshawar',intro:'Explore household staffing enquiries for Peshawar.',areas:['Hayatabad','University Town','Cantt','Warsak Road']},
  {slug:'gujranwala',name:'Gujranwala',intro:'Discuss household staff needs and practical placement arrangements.',areas:['DC Colony','Satellite Town','Wapda Town']},
  {slug:'hyderabad',name:'Hyderabad',intro:'Domestic staffing assistance by enquiry and availability.',areas:['Qasimabad','Latifabad','Auto Bhan Road']},
  {slug:'quetta',name:'Quetta',intro:'Domestic staff searches coordinated following a requirements discussion.',areas:['Jinnah Town','Cantt','Samungli Road']}
];
export const faqs = [
  {q:'How quickly can I get staff?',a:'Availability and joining time depend on the role, city, salary budget and working hours. Tell us your requirement and we will discuss the current candidate search and realistic timeline.'},
  {q:'Do you provide trained and verified staff?',a:'We coordinate candidates and discuss their background, experience and references. Please confirm the verification performed for the specific candidate before finalizing a placement.'},
  {q:'What is the fee for hiring staff?',a:'For a standard monthly placement, the one-time agency placement fee is one agreed monthly staff salary. The worker’s salary is separate. All terms should be confirmed in writing.'},
  {q:'Is there a replacement guarantee?',a:'Standard monthly placements include six-month replacement support, subject to the agreed written conditions and eligibility.'},
  {q:'Do you provide staff in other cities?',a:'We accept staffing enquiries from across Pakistan. Availability depends on the role, city and local candidate search. A city page does not indicate a branch office in that city.'},
  {q:'How do I request a candidate?',a:'Share the role, city/area, working hours, salary budget and ideal start date through our enquiry form, WhatsApp or a phone call.'}
];
export const steps = [
  {title:'Tell us your requirements',body:'Share your staff needs, duties, city, schedule and salary budget.'},
  {title:'We coordinate candidates',body:'Our team reviews your brief and arranges suitable candidates to assess.'},
  {title:'Hire with confidence',body:'Confirm duties, salary, placement fee and written replacement terms.'}
];
export const WA = (role?:string, city?:string) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Hello Domestic Staff Provider, I would like to hire ${role || 'domestic staff'}${city ? ` in ${city}` : ''}. Please share the hiring process and availability.`)}`;
