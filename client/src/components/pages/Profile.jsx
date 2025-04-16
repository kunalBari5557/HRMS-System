import React, { useState } from "react";

const EmployeeProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [sections, setSections] = useState({
    basicInfo: {
      firstName: "Mark",
      lastName: "Wood",
      dob: "",
      gender: "",
    },
    familyInfo: [],
    contacts: [],
    emergencyContacts: [],
  });
  const [showAddForm, setShowAddForm] = useState({
    family: false,
    contact: false,
    emergency: false,
  });
  const [newEntry, setNewEntry] = useState({
    family: { name: "", relationship: "" },
    contact: { type: "phone", value: "" },
    emergency: { name: "", phone: "", relationship: "" },
  });

  const tabs = [
    { id: "personal", label: "Personal" },
    { id: "job", label: "Job" },
    { id: "documents", label: "Documents" },
  ];

  const handleAddFamily = () => {
    setSections({
      ...sections,
      familyInfo: [...sections.familyInfo, newEntry.family],
    });
    setNewEntry({
      ...newEntry,
      family: { name: "", relationship: "" },
    });
    setShowAddForm({ ...showAddForm, family: false });
  };

  const handleAddContact = () => {
    setSections({
      ...sections,
      contacts: [...sections.contacts, newEntry.contact],
    });
    setNewEntry({
      ...newEntry,
      contact: { type: "phone", value: "" },
    });
    setShowAddForm({ ...showAddForm, contact: false });
  };

  const handleAddEmergencyContact = () => {
    setSections({
      ...sections,
      emergencyContacts: [...sections.emergencyContacts, newEntry.emergency],
    });
    setNewEntry({
      ...newEntry,
      emergency: { name: "", phone: "", relationship: "" },
    });
    setShowAddForm({ ...showAddForm, emergency: false });
  };

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setSections({
      ...sections,
      basicInfo: {
        ...sections.basicInfo,
        [name]: value,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header Section */}
      <div className="bg-blue-600 p-6 text-white">
        <h1 className="text-2xl font-bold">Employee Profile</h1>
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Amelia Johnson</h2>
          <p className="text-blue-100">UI/UX Designer</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-6 py-3 font-medium text-sm focus:outline-none ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 max-h-[450px] overflow-y-auto">
        {activeTab === "personal" && (
          <div className="space-y-6">
            {/* Basic Info Section */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Basic Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={sections.basicInfo.firstName}
                    onChange={handleBasicInfoChange}
                    className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={sections.basicInfo.lastName}
                    onChange={handleBasicInfoChange}
                    disabled // Ensuring disabled fields are readable
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 shadow-sm sm:text-sm"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={sections.basicInfo.dob}
                    onChange={handleBasicInfoChange}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 shadow-sm sm:text-sm"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={sections.basicInfo.gender}
                    onChange={handleBasicInfoChange}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 shadow-sm sm:text-sm"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Family Info Section */}
            <div className="border-b pb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Family Info
                </h3>
                {!showAddForm.family && (
                  <button
                    onClick={() =>
                      setShowAddForm({ ...showAddForm, family: true })
                    }
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Family Info
                  </button>
                )}
              </div>

              {showAddForm.family && (
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        value={newEntry.family.name}
                        onChange={(e) =>
                          setNewEntry({
                            ...newEntry,
                            family: {
                              ...newEntry.family,
                              name: e.target.value,
                            },
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 shadow-sm sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Relationship
                      </label>
                      <input
                        type="text"
                        value={newEntry.family.relationship}
                        onChange={(e) =>
                          setNewEntry({
                            ...newEntry,
                            family: {
                              ...newEntry.family,
                              relationship: e.target.value,
                            },
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 shadow-sm sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() =>
                        setShowAddForm({ ...showAddForm, family: false })
                      }
                      className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddFamily}
                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              {sections.familyInfo.length > 0 ? (
                <div className="space-y-2">
                  {sections.familyInfo.map((member, index) => (
                    <div
                      key={index}
                      className="flex justify-between p-2 bg-gray-50 rounded"
                    >
                      <div>
                        <span className="font-medium">{member.name}</span> -{" "}
                        {member.relationship}
                      </div>
                      <button className="text-red-500 hover:text-red-700 text-sm">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                !showAddForm.family && (
                  <div className="text-sm text-gray-500">
                    No family information added yet
                  </div>
                )
              )}
            </div>

            {/* Contact & Social Links Section */}
            <div className="border-b pb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Contact & Social Links
                </h3>
                {!showAddForm.contact && (
                  <button
                    onClick={() =>
                      setShowAddForm({ ...showAddForm, contact: true })
                    }
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Contact Info
                  </button>
                )}
              </div>

              {showAddForm.contact && (
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Type
                      </label>
                      <select
                        value={newEntry.contact.type}
                        onChange={(e) =>
                          setNewEntry({
                            ...newEntry,
                            contact: {
                              ...newEntry.contact,
                              type: e.target.value,
                            },
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 shadow-sm sm:text-sm"
                      >
                        <option value="phone">Phone</option>
                        <option value="email">Email</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="twitter">Twitter</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Value
                      </label>
                      <input
                        type="text"
                        value={newEntry.contact.value}
                        onChange={(e) =>
                          setNewEntry({
                            ...newEntry,
                            contact: {
                              ...newEntry.contact,
                              value: e.target.value,
                            },
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 shadow-sm sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() =>
                        setShowAddForm({ ...showAddForm, contact: false })
                      }
                      className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddContact}
                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              {sections.contacts.length > 0 ? (
                <div className="space-y-2">
                  {sections.contacts.map((contact, index) => (
                    <div
                      key={index}
                      className="flex justify-between p-2 bg-gray-50 rounded"
                    >
                      <div>
                        <span className="capitalize font-medium">
                          {contact.type}
                        </span>
                        : {contact.value}
                      </div>
                      <button className="text-red-500 hover:text-red-700 text-sm">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                !showAddForm.contact && (
                  <div className="text-sm text-gray-500">
                    No contact information added yet
                  </div>
                )
              )}
            </div>

            {/* Emergency Contact Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Emergency Contact
                </h3>
                {!showAddForm.emergency && (
                  <button
                    onClick={() =>
                      setShowAddForm({ ...showAddForm, emergency: true })
                    }
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Emergency Contact
                  </button>
                )}
              </div>

              {showAddForm.emergency && (
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        value={newEntry.emergency.name}
                        onChange={(e) =>
                          setNewEntry({
                            ...newEntry,
                            emergency: {
                              ...newEntry.emergency,
                              name: e.target.value,
                            },
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 shadow-sm sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={newEntry.emergency.phone}
                        onChange={(e) =>
                          setNewEntry({
                            ...newEntry,
                            emergency: {
                              ...newEntry.emergency,
                              phone: e.target.value,
                            },
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 shadow-sm sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Relationship
                      </label>
                      <input
                        type="text"
                        value={newEntry.emergency.relationship}
                        onChange={(e) =>
                          setNewEntry({
                            ...newEntry,
                            emergency: {
                              ...newEntry.emergency,
                              relationship: e.target.value,
                            },
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 shadow-sm sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() =>
                        setShowAddForm({ ...showAddForm, emergency: false })
                      }
                      className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddEmergencyContact}
                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              {sections.emergencyContacts.length > 0 ? (
                <div className="space-y-2">
                  {sections.emergencyContacts.map((contact, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{contact.name}</h4>
                          <p className="text-sm">Phone: {contact.phone}</p>
                          <p className="text-sm">
                            Relationship: {contact.relationship}
                          </p>
                        </div>
                        <button className="text-red-500 hover:text-red-700 text-sm self-start">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !showAddForm.emergency && (
                  <div className="text-sm text-gray-500">
                    No emergency contact added yet
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {activeTab === "job" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Company Name *
              </label>
              <p className="text-gray-900">Superworks Pvt. Ltd</p>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Employee ID *
              </label>
              <p className="text-gray-900">#SUP123</p>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Joining Date *
              </label>
              <p className="text-gray-900">01 Jan, 2024</p>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="text-center py-12">
            <p className="text-gray-500">No documents uploaded yet</p>
            <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Upload Document
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfile;
