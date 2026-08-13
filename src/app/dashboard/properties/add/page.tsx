'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Home, FileText, Loader2, CheckCircle2, Sparkles, BedDouble, Bath, Ruler, Calendar, TreePine, Building2, User, AlertCircle, ArrowRight, Edit3 } from 'lucide-react';
import { readProperties, writeProperties, type PreserveProperty } from '@/lib/localData';

const NC_COUNTIES = ['Alamance','Alexander','Alleghany','Anson','Ashe','Avery','Beaufort','Bertie','Bladen','Brunswick','Buncombe','Burke','Cabarrus','Caldwell','Camden','Carteret','Caswell','Catawba','Chatham','Cherokee','Chowan','Clay','Cleveland','Columbus','Craven','Cumberland','Currituck','Dare','Davidson','Davie','Duplin','Durham','Edgecombe','Forsyth','Franklin','Gaston','Gates','Graham','Granville','Greene','Guilford','Halifax','Harnett','Haywood','Henderson','Hertford','Hoke','Hyde','Iredell','Jackson','Johnston','Jones','Lee','Lenoir','Lincoln','Macon','Madison','Martin','McDowell','Mecklenburg','Mitchell','Montgomery','Moore','Nash','New Hanover','Northampton','Onslow','Orange','Pamlico','Pasquotank','Pender','Perquimans','Person','Pitt','Polk','Randolph','Richmond','Robeson','Rockingham','Rowan','Rutherford','Sampson','Scotland','Stanly','Stokes','Surry','Swain','Transylvania','Tyrrell','Union','Vance','Wake','Warren','Washington','Watauga','Wayne','Wilkes','Wilson','Yadkin','Yancey'];

type Step = 'search'|'confirm'|'manual'|'saving'|'done';
type LookupResult = { address:string; city:string; state:string; zip:string; county:string; beds:number|null; baths:number|null; sqft:number|null; year_built:number|null; property_type:string|null; stories:number|null; lot_size:number|null; apn:string|null; owner_name:string|null; estimated_value:number|null; };
type Extras = { nickname:string; notes:string; county:string; purpose:string; };
const defaultManual = { address:'', city:'', state:'NC', zip:'', county:'', propertyType:'', parcelId:'', notes:'', purpose:'' };

export default function AddPropertyPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('search');
  const [searchAddress, setSearchAddress] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchState, setSearchState] = useState('NC');
  const [searchZip, setSearchZip] = useState('');
  const [lookingUp, setLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [result, setResult] = useState<LookupResult|null>(null);
  const [extras, setExtras] = useState<Extras>({ nickname:'', notes:'', county:'', purpose:'' });
  const [manual, setManual] = useState(defaultManual);

  const handleLookup = async () => {
    if (!searchAddress || !searchCity) { setLookupError('Please enter a street address and city.'); return; }
    setLookingUp(true); setLookupError('');
    try {
      const params = new URLSearchParams({ street: searchAddress, city: searchCity, state: searchState, zip: searchZip });
      const res = await fetch(`/api/property-lookup?${params}`);
      const data = await res.json();
      if (!res.ok) { setLookupError(data.error || 'Property not found. You can add it manually.'); return; }
      setResult(data);
      setExtras({ nickname:'', notes:'', county: data.county?.replace(' County','') || '', purpose:'' });
      setStep('confirm');
    } catch { setLookupError('Lookup failed. Please try again or add manually.'); }
    finally { setLookingUp(false); }
  };

  const handleSaveFromLookup = () => {
    if (!result) return;
    setStep('saving');
    const p: PreserveProperty = { id:`prop_${Date.now()}`, address:result.address, city:result.city, state:result.state, zip:result.zip, county:extras.county, propertyType:result.property_type||'', parcelId:result.apn||'', notes:extras.notes, status:'active' };
    writeProperties([...readProperties(), p]);
    setStep('done');
    setTimeout(() => router.push('/dashboard/properties'), 1500);
  };

  const handleSaveManual = (e: React.FormEvent) => {
    e.preventDefault(); setStep('saving');
    const p: PreserveProperty = { id:`prop_${Date.now()}`, address:manual.address, city:manual.city, state:manual.state, zip:manual.zip, county:manual.county, propertyType:manual.propertyType, parcelId:manual.parcelId, notes:manual.notes, status:'active' };
    writeProperties([...readProperties(), p]);
    setStep('done');
    setTimeout(() => router.push('/dashboard/properties'), 1500);
  };

  const fmt = (v: number|null|undefined, suffix='') => v != null ? `${v.toLocaleString()}${suffix}` : '—';
  const stepIdx = step==='confirm' ? 1 : (step==='saving'||step==='done') ? 2 : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-lg">P</span></div>
            <span className="text-xl font-bold text-slate-900">Preserve</span>
          </Link>
          <Link href="/dashboard/properties" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 text-sm"><ArrowLeft className="w-4 h-4" /><span className="hidden sm:inline">Back to Properties</span></Link>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 md:px-6 py-6 md:py-8 pb-24">
        <div className="mb-6"><h1 className="text-2xl font-bold text-slate-900">Add New Property</h1><p className="text-slate-500 text-sm mt-1">Personal homes, rentals, foreclosures &amp; investments — search by address and we&apos;ll pull in the details.</p></div>

        {step !== 'done' && step !== 'manual' && (
          <div className="flex items-center gap-2 mb-6">
            {[{l:'Search'},{l:'Confirm'},{l:'Save'}].map((s,i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${i<stepIdx?'bg-green-100 text-green-700':i===stepIdx?'bg-blue-600 text-white':'bg-slate-100 text-slate-400'}`}>
                  {i<stepIdx?<CheckCircle2 className="w-3 h-3"/>:<span>{i+1}.</span>}{s.l}
                </div>
                {i<2&&<div className="w-8 h-px bg-slate-200"/>}
              </div>
            ))}
          </div>
        )}

        {step==='search'&&(
          <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2"><div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center"><MapPin className="w-5 h-5 text-blue-600"/></div><div><h2 className="font-semibold text-slate-900">Enter Property Address</h2><p className="text-sm text-slate-500">We&apos;ll look up beds, baths, sqft &amp; more</p></div></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Street Address *</label><input type="text" value={searchAddress} onChange={e=>setSearchAddress(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLookup()} placeholder="e.g. 123 Oak Street" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm"/></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">City *</label><input type="text" value={searchCity} onChange={e=>setSearchCity(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLookup()} placeholder="Charlotte" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm"/></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">ZIP Code</label><input type="text" value={searchZip} onChange={e=>setSearchZip(e.target.value)} placeholder="28201" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm"/></div>
            </div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">State</label><input type="text" value={searchState} onChange={e=>setSearchState(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm"/></div>
            {lookupError&&(<div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm"><AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"/><div><p className="font-medium text-amber-800">{lookupError}</p><button onClick={()=>setStep('manual')} className="mt-1 text-blue-600 underline text-xs">Add manually instead →</button></div></div>)}
            <button onClick={handleLookup} disabled={lookingUp||!searchAddress||!searchCity} className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm">
              {lookingUp?<><Loader2 className="w-5 h-5 animate-spin"/>Looking up property…</>:<><Sparkles className="w-5 h-5"/>Look Up Property Details</>}
            </button>
            <div className="text-center"><button onClick={()=>setStep('manual')} className="text-xs text-slate-400 hover:text-slate-600 underline">Skip — enter manually</button></div>
          </div>
        )}

        {step==='confirm'&&result&&(
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg">
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-wide mb-2">✅ Property Found</p>
              <h2 className="text-xl font-bold">{result.address}</h2>
              <p className="text-blue-100 mt-1">{result.city}, {result.state} {result.zip}</p>
              {result.county&&<p className="text-blue-200 text-sm mt-0.5">{result.county} County</p>}
              {result.estimated_value!=null&&(<div className="mt-4 pt-4 border-t border-blue-500/60"><p className="text-blue-200 text-sm">Estimated Value</p><p className="text-2xl font-bold">${result.estimated_value.toLocaleString()}</p></div>)}
            </div>
            <div className="bg-white rounded-2xl shadow-sm border p-5">
              <p className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-500"/>Property Details — Please Confirm</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[{icon:BedDouble,label:'Bedrooms',value:fmt(result.beds)},{icon:Bath,label:'Bathrooms',value:fmt(result.baths)},{icon:Ruler,label:'Sq Ft',value:fmt(result.sqft,' sq ft')},{icon:Calendar,label:'Year Built',value:fmt(result.year_built)},{icon:TreePine,label:'Lot Size',value:fmt(result.lot_size,' sq ft')},{icon:Home,label:'Stories',value:fmt(result.stories)}].map(({icon:Icon,label,value})=>(
                  <div key={label} className="bg-slate-50 rounded-xl p-3"><div className="flex items-center gap-1.5 mb-1"><Icon className="w-3.5 h-3.5 text-blue-500"/><span className="text-xs text-slate-400">{label}</span></div><p className="font-semibold text-slate-900 text-sm">{value}</p></div>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-400 mb-1">Property Type</p><p className="font-semibold text-slate-900 text-sm">{result.property_type||'—'}</p></div>
                <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-400 mb-1">APN / Parcel ID</p><p className="font-semibold text-slate-900 text-sm truncate">{result.apn||'—'}</p></div>
              </div>
              {result.owner_name&&(<div className="mt-3 flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100"><User className="w-4 h-4 text-blue-600 shrink-0"/><div><p className="text-xs text-blue-600 font-medium">Owner on Record</p><p className="font-semibold text-slate-900 text-sm">{result.owner_name}</p></div></div>)}
            </div>
            <div className="bg-white rounded-2xl shadow-sm border p-5">
              <p className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2"><Edit3 className="w-4 h-4 text-blue-500"/>Add Your Details (Optional)</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Property Purpose *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value:'personal', label:'🏠 Personal Home', desc:'Primary or vacation home' },
                      { value:'rental', label:'🏘️ Rental Property', desc:'Tenant occupied' },
                      { value:'foreclosure', label:'🏦 Foreclosure / REO', desc:'Bank or lender owned' },
                      { value:'investment', label:'📈 Investment', desc:'Vacant or for sale' },
                    ].map(opt => (
                      <button key={opt.value} type="button" onClick={()=>setExtras(p=>({...p,purpose:opt.value}))}
                        className={`text-left p-3 rounded-xl border-2 transition-all ${extras.purpose===opt.value?'border-blue-500 bg-blue-50':'border-slate-200 hover:border-slate-300 bg-white'}`}>
                        <p className="text-xs font-semibold text-slate-900">{opt.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-medium text-slate-600 mb-1">County</label><select value={extras.county} onChange={e=>setExtras(p=>({...p,county:e.target.value}))} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm bg-white"><option value="">Select county</option>{NC_COUNTIES.map(c=><option key={c} value={c}>{c} County</option>)}</select></div>
                  <div><label className="block text-xs font-medium text-slate-600 mb-1">Nickname</label><input type="text" value={extras.nickname} onChange={e=>setExtras(p=>({...p,nickname:e.target.value}))} placeholder="e.g. Beach House" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm"/></div>
                </div>
                <div><label className="block text-xs font-medium text-slate-600 mb-1">Notes / Access Instructions</label><textarea value={extras.notes} onChange={e=>setExtras(p=>({...p,notes:e.target.value}))} rows={2} placeholder="Access code, gate info, special notes…" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm resize-none"/></div>
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button onClick={()=>setStep('search')} className="flex-1 py-3 px-4 border border-slate-300 rounded-xl text-slate-600 font-medium hover:bg-slate-50 text-sm flex items-center justify-center gap-2"><ArrowLeft className="w-4 h-4"/>Search Again</button>
              <button onClick={handleSaveFromLookup} className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 text-sm flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4"/>Confirm &amp; Add Property<ArrowRight className="w-4 h-4"/></button>
            </div>
          </div>
        )}

        {step==='manual'&&(
          <form onSubmit={handleSaveManual} className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2"><div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center"><FileText className="w-5 h-5 text-purple-600"/></div><div><h2 className="font-semibold text-slate-900">Manual Entry</h2><p className="text-sm text-slate-500">Fill in the property details below</p></div></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Street Address *</label><input required type="text" value={manual.address} onChange={e=>setManual(p=>({...p,address:e.target.value}))} placeholder="123 Main Street" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm"/></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">City *</label><input required type="text" value={manual.city} onChange={e=>setManual(p=>({...p,city:e.target.value}))} placeholder="Charlotte" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm"/></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">ZIP</label><input type="text" value={manual.zip} onChange={e=>setManual(p=>({...p,zip:e.target.value}))} placeholder="28201" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm"/></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">County</label><select value={manual.county} onChange={e=>setManual(p=>({...p,county:e.target.value}))} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm bg-white"><option value="">Select county</option>{NC_COUNTIES.map(c=><option key={c} value={c}>{c} County</option>)}</select></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Property Type</label><select value={manual.propertyType} onChange={e=>setManual(p=>({...p,propertyType:e.target.value}))} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm bg-white"><option value="">Select type</option><option>Single Family</option><option>Condo</option><option>Townhouse</option><option>Multi-Family</option><option>Commercial</option><option>Vacant Land</option></select></div>
            </div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Notes</label><textarea value={manual.notes} onChange={e=>setManual(p=>({...p,notes:e.target.value}))} rows={2} placeholder="Any additional notes…" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm resize-none"/></div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Property Purpose</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value:'personal', label:'🏠 Personal Home', desc:'Primary or vacation home' },
                  { value:'rental', label:'🏘️ Rental Property', desc:'Tenant occupied' },
                  { value:'foreclosure', label:'🏦 Foreclosure / REO', desc:'Bank or lender owned' },
                  { value:'investment', label:'📈 Investment', desc:'Vacant or for sale' },
                ].map(opt => (
                  <button key={opt.value} type="button" onClick={()=>setManual(p=>({...p,purpose:opt.value}))}
                    className={`text-left p-3 rounded-xl border-2 transition-all ${manual.purpose===opt.value?'border-blue-500 bg-blue-50':'border-slate-200 hover:border-slate-300 bg-white'}`}>
                    <p className="text-xs font-semibold text-slate-900">{opt.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <button type="button" onClick={()=>setStep('search')} className="flex-1 py-3 border border-slate-300 rounded-xl text-slate-600 font-medium hover:bg-slate-50 text-sm">← Back to Search</button>
              <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 text-sm">Add Property</button>
            </div>
          </form>
        )}

        {(step==='saving'||step==='done')&&(
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            {step==='saving'?<><Loader2 className="w-12 h-12 text-blue-500 animate-spin"/><p className="text-slate-600 text-sm">Saving property…</p></>:<><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"><CheckCircle2 className="w-8 h-8 text-green-600"/></div><p className="text-xl font-bold text-slate-900">Property Added!</p><p className="text-slate-500 text-sm">Redirecting to your properties…</p></>}
          </div>
        )}
      </main>
    </div>
  );
}
