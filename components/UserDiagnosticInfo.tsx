import { Prisma } from '@prisma/client';
import Link from 'next/link';
import type { User } from '@prisma/client';

type ProjectWithUser = Prisma.ProjectGetPayload<{
  include: { user: true; coEditors: true };
}>;

function projectsList(projects: ProjectWithUser[]) {
  return (
    <ul>
      {projects.map((project, i) => {
        return (
          <li key={i}>
            <Link href={`/project/${project.id}`}>{project.title}</Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function UserDiagnosticInfo({
  user,
  projectsAsOwner,
  projectsCoEditor,
}: {
  user: User;
  projectsAsOwner: ProjectWithUser[];
  projectsCoEditor: ProjectWithUser[];
}) {
  const ownerProjectsList = projectsList(projectsAsOwner);
  const coEditorProjectsList = projectsList(projectsCoEditor);
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
      {projectsAsOwner.length > 0 && <h2>Projects as Owner</h2>}
      {projectsAsOwner.length > 0 && ownerProjectsList}

      {projectsCoEditor.length > 0 && <h2>Projects as CoEditor</h2>}
      {projectsCoEditor.length > 0 && coEditorProjectsList}
    </>
  );
}
