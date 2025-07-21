import { useEffect, useState } from "react";
import axiosInstance from "./../../../utils/axios";
import { Link } from "react-router-dom";

const User = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axiosInstance.get("/api/user").then((res) => {
      setUsers(res.data);
    });
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Quản lý người dùng</h1>

      <div className="overflow-x-auto rounded-lg shadow-sm bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-5 py-3">#</th>
              <th className="px-5 py-3">Tên</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Chức vụ</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.map((u, index) => (
              <tr
                key={u._id}
                className="hover:bg-blue-50 transition duration-200 ease-in-out"
              >
                <td className="px-5 py-3">{index + 1}</td>
                <td className="px-5 py-3">
                  <Link
                    to={`/admin/user/${u._id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {u.name}
                  </Link>
                </td>
                <td className="px-5 py-3">{u.email}</td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      u.role === "staff"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {u.role === "staff" ? "Nhân viên" : "Người dùng"}
                  </span>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500 italic">
                  Không có người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;
