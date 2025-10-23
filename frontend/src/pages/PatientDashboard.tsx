import React, { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Search, 
  Star, 
  History,
  MapPin,
  Clock,
  AlertTriangle,
  Stethoscope,
  Heart
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import WalletConnect from '../components/WalletConnect'

// Patient Dashboard Components
const PatientHome: React.FC = () => {
  const { user } = useAuth()
  const [isEmergency, setIsEmergency] = useState(false)

  const handleEmergencyToggle = () => {
    setIsEmergency(!isEmergency)
    // TODO: Integrate with smart contract to set emergency status
    console.log('Emergency status:', !isEmergency)
  }

  return (
    <div className="space-y-6">
      <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-primary/20">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h2>
        
        {/* Emergency Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Emergency Status</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isEmergency 
                ? 'text-red-600 bg-red-50 dark:bg-red-900/20' 
                : 'text-green-600 bg-green-50 dark:bg-green-900/20'
            }`}>
              {isEmergency ? 'EMERGENCY ACTIVE' : 'SAFE'}
            </div>
          </div>
          
          <button
            onClick={handleEmergencyToggle}
            className={`w-full py-4 px-6 rounded-xl font-semibold transition-colors ${
              isEmergency
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isEmergency ? 'Cancel Emergency' : 'SOS - Emergency Help'}
          </button>
          
          {isEmergency && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2 text-red-700 dark:text-red-300">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Emergency Active</span>
              </div>
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                Nearby doctors have been notified. Help is on the way.
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-primary/10 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Stethoscope className="w-6 h-6 text-primary" />
              <h3 className="font-semibold">Consultations</h3>
            </div>
            <p className="text-text-light/70 dark:text-text-dark/70">
              12 completed
            </p>
          </div>
          
          <div className="bg-secondary/10 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Star className="w-6 h-6 text-secondary" />
              <h3 className="font-semibold">Ratings Given</h3>
            </div>
            <p className="text-text-light/70 dark:text-text-dark/70">
              8 reviews
            </p>
          </div>
          
          <div className="bg-green-500/10 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Heart className="w-6 h-6 text-green-500" />
              <h3 className="font-semibold">Health Score</h3>
            </div>
            <p className="text-text-light/70 dark:text-text-dark/70">
              85/100
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-primary/20">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/patient/docfind"
            className="flex items-center space-x-3 p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
          >
            <Search className="w-6 h-6 text-primary" />
            <div>
              <div className="font-medium">Find Doctors</div>
              <div className="text-sm text-text-light/70 dark:text-text-dark/70">
                Search for nearby doctors
              </div>
            </div>
          </Link>
          
          <Link
            to="/patient/rating"
            className="flex items-center space-x-3 p-4 bg-secondary/10 hover:bg-secondary/20 rounded-lg transition-colors"
          >
            <Star className="w-6 h-6 text-secondary" />
            <div>
              <div className="font-medium">Rate Doctors</div>
              <div className="text-sm text-text-light/70 dark:text-text-dark/70">
                Review your consultations
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Wallet Connection for Blockchain Activities */}
      <WalletConnect />
    </div>
  )
}

const DocFind: React.FC = () => {
  const [doctors] = useState([
    {
      id: 1,
      name: 'Dr. Alice Johnson',
      specialization: 'Emergency Medicine',
      rating: 4.8,
      distance: '1.2 km',
      location: 'New York, NY',
      consultations: 150,
      available: true,
      responseTime: '5 min'
    },
    {
      id: 2,
      name: 'Dr. Bob Wilson',
      specialization: 'General Practice',
      rating: 4.5,
      distance: '2.8 km',
      location: 'Brooklyn, NY',
      consultations: 200,
      available: true,
      responseTime: '8 min'
    },
    {
      id: 3,
      name: 'Dr. Carol Davis',
      specialization: 'Cardiology',
      rating: 4.9,
      distance: '4.1 km',
      location: 'Queens, NY',
      consultations: 120,
      available: false,
      responseTime: '15 min'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialization = !selectedSpecialization || doctor.specialization === selectedSpecialization
    return matchesSearch && matchesSpecialization
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Find Doctors</h2>
        <div className="flex items-center space-x-2 text-sm text-text-light/70 dark:text-text-dark/70">
          <MapPin className="w-4 h-4" />
          <span>Showing doctors within 10km radius</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-primary/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Search by name or specialization..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Specialization</label>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Specializations</option>
              <option value="Emergency Medicine">Emergency Medicine</option>
              <option value="General Practice">General Practice</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Surgery">Surgery</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctors List */}
      <div className="grid gap-4">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-primary/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl">{doctor.name}</h3>
                  <p className="text-primary font-medium">{doctor.specialization}</p>
                  <div className="flex items-center space-x-4 text-sm text-text-light/70 dark:text-text-dark/70 mt-1">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{doctor.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{doctor.distance} away</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold">{doctor.rating}</span>
                </div>
                <div className="text-sm text-text-light/70 dark:text-text-dark/70">
                  {doctor.consultations} consultations
                </div>
                <div className={`text-xs font-medium ${
                  doctor.available ? 'text-green-600' : 'text-red-600'
                }`}>
                  {doctor.available ? 'Available' : 'Busy'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-text-light/70 dark:text-text-dark/70">
                Avg. response time: <span className="font-medium">{doctor.responseTime}</span>
              </div>
              <div className="flex space-x-3">
                <button 
                  disabled={!doctor.available}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    doctor.available
                      ? 'bg-primary hover:bg-primary/90 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Request Consultation
                </button>
                <button className="px-4 py-2 border border-primary text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const DocRating: React.FC = () => {
  const [consultations] = useState([
    {
      id: 1,
      doctor: 'Dr. Alice Johnson',
      specialization: 'Emergency Medicine',
      date: '2024-01-15',
      treatment: 'Chest pain evaluation',
      rated: false
    },
    {
      id: 2,
      doctor: 'Dr. Bob Wilson',
      specialization: 'General Practice',
      date: '2024-01-12',
      treatment: 'General checkup',
      rated: true,
      rating: 4,
      comment: 'Good doctor, explained everything clearly.'
    },
    {
      id: 3,
      doctor: 'Dr. Carol Davis',
      specialization: 'Cardiology',
      date: '2024-01-10',
      treatment: 'Heart examination',
      rated: true,
      rating: 5,
      comment: 'Excellent care and very professional!'
    }
  ])

  const [ratingForm, setRatingForm] = useState({
    consultationId: 0,
    rating: 0,
    comment: ''
  })

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Integrate with smart contract
    console.log('Rating submitted:', ratingForm)
    alert('Rating submitted successfully!')
    setRatingForm({ consultationId: 0, rating: 0, comment: '' })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Rate Doctors</h2>
      
      {/* Wallet Connection for Blockchain Activities */}
      <WalletConnect />
      
      <div className="space-y-4">
        {consultations.map((consultation) => (
          <div key={consultation.id} className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-primary/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{consultation.doctor}</h3>
                  <p className="text-primary">{consultation.specialization}</p>
                  <div className="text-sm text-text-light/70 dark:text-text-dark/70">
                    {consultation.treatment} • {consultation.date}
                  </div>
                </div>
              </div>
              
              {consultation.rated ? (
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (consultation.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-text-light/70 dark:text-text-dark/70">
                    Rated
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setRatingForm({ ...ratingForm, consultationId: consultation.id })}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                >
                  Rate Now
                </button>
              )}
            </div>

            {consultation.rated && consultation.comment && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-text-light/70 dark:text-text-dark/70">
                  "{consultation.comment}"
                </p>
              </div>
            )}

            {/* Rating Form */}
            {ratingForm.consultationId === consultation.id && (
              <form onSubmit={handleRatingSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingForm({ ...ratingForm, rating: star })}
                        className={`w-8 h-8 ${
                          star <= ratingForm.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        <Star className="w-full h-full fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Comment</label>
                  <textarea
                    value={ratingForm.comment}
                    onChange={(e) => setRatingForm({ ...ratingForm, comment: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    placeholder="Share your experience..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={ratingForm.rating === 0}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Rating
                  </button>
                  <button
                    type="button"
                    onClick={() => setRatingForm({ consultationId: 0, rating: 0, comment: '' })}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const PatientHistory: React.FC = () => {
  const [consultations] = useState([
    {
      id: 1,
      doctor: 'Dr. Alice Johnson',
      specialization: 'Emergency Medicine',
      date: '2024-01-15',
      treatment: 'Chest pain evaluation',
      status: 'completed',
      powSubmitted: true,
      rating: 5
    },
    {
      id: 2,
      doctor: 'Dr. Bob Wilson',
      specialization: 'General Practice',
      date: '2024-01-12',
      treatment: 'General checkup',
      status: 'completed',
      powSubmitted: true,
      rating: 4
    },
    {
      id: 3,
      doctor: 'Dr. Carol Davis',
      specialization: 'Cardiology',
      date: '2024-01-10',
      treatment: 'Heart examination',
      status: 'completed',
      powSubmitted: true,
      rating: 5
    }
  ])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Consultation History</h2>
      
      <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-primary/20">
        <div className="space-y-4">
          {consultations.map((consultation) => (
            <div key={consultation.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-medium">{consultation.doctor}</div>
                  <div className="text-sm text-text-light/70 dark:text-text-dark/70">
                    {consultation.treatment}
                  </div>
                  <div className="text-xs text-text-light/50 dark:text-text-dark/50">
                    {consultation.date}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < consultation.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <div className="text-sm text-green-600">
                  Completed
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const PatientDashboard: React.FC = () => {
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/patient', icon: Home },
    { name: 'DocFind', href: '/patient/docfind', icon: Search },
    { name: 'DocRating', href: '/patient/rating', icon: Star },
    { name: 'History', href: '/patient/history', icon: History },
  ]

  return (
    <div className="flex space-x-8">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text-light dark:text-text-dark hover:bg-primary/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<PatientHome />} />
          <Route path="/docfind" element={<DocFind />} />
          <Route path="/rating" element={<DocRating />} />
          <Route path="/history" element={<PatientHistory />} />
        </Routes>
      </div>
    </div>
  )
}

export default PatientDashboard
