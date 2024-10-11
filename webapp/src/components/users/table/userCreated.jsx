/* eslint-disable react/prop-types */
import  { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserCreated({ admins }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter admins based on the search term
  const filteredAdmins = admins?.filter(admin =>
    admin.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      {/* Search Input */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by username or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Table to display admins */}
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdmins?.length > 0 ? (
            filteredAdmins?.map((admin, index) => (
              <tr key={index}>
                <td>{admin?.username || 'No data'}</td>
                <td>{admin?.email || 'No data'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center">No data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserCreated;
