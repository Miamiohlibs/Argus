import { Prisma } from '@prisma/client';
import Link from 'next/link';
import type { User } from '@prisma/client';

type ProjectWithUser = Prisma.ProjectGetPayload<{
  include: { user: true; coEditors: true };
}>;

export default function UserDiagnosticInfo({
  user,
  projects,
}: {
  user: User;
  projects: ProjectWithUser[];
}) {
  return (
    <>
      <h1>User: {user.name}</h1>
      <h2>Profile</h2>
      <ul>
        <li>
          <b className="listLabel">Email: </b>
          <span className="listValue">{user.email}</span>
        </li>
        <li>
          <b className="listLabel">Role: </b>
          <span className="listValue">{user.role}</span>
        </li>
        <li>
          <b className="listLabel">Affiliation: </b>
          <span className="listValue">{user.email}</span>
        </li>
        <li>
          <b className="listLabel">Status: </b>
          <span className="listValue">{user.status}</span>
        </li>
        <li>
          <b className="listLabel">Print Slips: </b>
          <span className="list-value">{user.printSlips}</span>
        </li>
        <li>
          <b className="listLabel">Created: </b>
          <span className="list-value">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </li>
        <li>
          <b className="listLabel">Updated: </b>
          <span className="list-value">
            {new Date(user.updatedAt).toLocaleDateString()}
          </span>
        </li>
      </ul>
      <h2>Projects</h2>
      <ul>
        {projects.map((project, i) => {
          return (
            <li key={i}>
              <Link href={`/project/${project.id}`}>{project.title}</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
